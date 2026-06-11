"use client";

import { listJobs } from "@/features/jobs/services/jobs.service";
import {
  ensureUsersSeed,
  findUserByNickname,
} from "@/features/auth/services/users.service";
import type { Application, ApplicationInput } from "../types";

declare global {
  // eslint-disable-next-line no-var
  var __nfilmApplications: Map<string, Application> | undefined;
  // eslint-disable-next-line no-var
  var __nfilmApplicationsSeeded: boolean | undefined;
}

const store: Map<string, Application> = (globalThis.__nfilmApplications ??= new Map());

function ulid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function ensureSeed(): Promise<void> {
  if (globalThis.__nfilmApplicationsSeeded) return;
  globalThis.__nfilmApplicationsSeeded = true;
  if (store.size > 0) return;
  ensureUsersSeed();
  const jobs = await listJobs();
  const khjJob = jobs.find((j) => j.authorName === "KHJ");
  const kim = await findUserByNickname("김정한");
  if (khjJob && kim) {
    const app: Application = {
      id: ulid(),
      jobId: khjJob.id,
      applicantId: kim.id,
      applicantNickname: kim.nickname,
      data: { name: "김정한", age: "32", gender: "남자", contact: "010-0000-0000", career: "연출부 5년" },
      createdAt: new Date(Date.now() - 36 * 60 * 60_000).toISOString(),
    };
    store.set(app.id, app);
  }
}

export async function createApplication(input: ApplicationInput): Promise<Application> {
  await ensureSeed();
  for (const a of store.values()) {
    if (a.jobId === input.jobId && a.applicantId === input.applicantId) {
      throw new Error("이미 신청한 공고입니다");
    }
  }
  const app: Application = {
    ...input,
    id: ulid(),
    createdAt: new Date().toISOString(),
  };
  store.set(app.id, app);
  return delay(app);
}

export async function listApplicationsByJob(jobId: string): Promise<Application[]> {
  await ensureSeed();
  const arr = Array.from(store.values()).filter((a) => a.jobId === jobId);
  arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(arr);
}

export async function listApplicationsByApplicant(
  applicantId: string,
): Promise<Application[]> {
  await ensureSeed();
  const arr = Array.from(store.values()).filter((a) => a.applicantId === applicantId);
  arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(arr);
}

export async function getApplicationOf(
  jobId: string,
  applicantId: string,
): Promise<Application | null> {
  await ensureSeed();
  for (const a of store.values()) {
    if (a.jobId === jobId && a.applicantId === applicantId) return delay(a);
  }
  return delay(null);
}

export function __resetApplicationsForTest(): void {
  store.clear();
  globalThis.__nfilmApplicationsSeeded = false;
}
