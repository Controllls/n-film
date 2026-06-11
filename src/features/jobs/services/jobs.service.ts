"use client";

import type { Job, JobInput } from "../types";
import { getSeedJobs } from "../lib/seed";

declare global {
  // eslint-disable-next-line no-var
  var __nfilmJobs: Map<string, Job> | undefined;
  // eslint-disable-next-line no-var
  var __nfilmJobsSeeded: boolean | undefined;
}

const store: Map<string, Job> = (globalThis.__nfilmJobs ??= new Map());

function ulid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function delay<T>(value: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function ensureSeed(): void {
  if (globalThis.__nfilmJobsSeeded) return;
  globalThis.__nfilmJobsSeeded = true;
  if (store.size > 0) return;
  for (const input of getSeedJobs()) {
    const job: Job = {
      ...input,
      id: ulid(),
      status: "open",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 60_000).toISOString(),
    };
    store.set(job.id, job);
  }
}

function sortJobs(arr: Job[]): Job[] {
  return arr.sort((a, b) => {
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    if (a.shootDate !== b.shootDate) return a.shootDate < b.shootDate ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function listJobs(): Promise<Job[]> {
  ensureSeed();
  return delay(sortJobs(Array.from(store.values())));
}

export async function getJob(id: string): Promise<Job | null> {
  ensureSeed();
  return delay(store.get(id) ?? null);
}

export async function createJob(input: JobInput): Promise<Job> {
  const job: Job = {
    ...input,
    id: ulid(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  store.set(job.id, job);
  return delay(job);
}

export async function toggleJobStatus(id: string): Promise<Job> {
  const current = store.get(id);
  if (!current) throw new Error("공고를 찾을 수 없습니다");
  const next: Job = {
    ...current,
    status: current.status === "open" ? "closed" : "open",
  };
  store.set(id, next);
  return delay(next);
}

export function __resetForTest(): void {
  store.clear();
  globalThis.__nfilmJobsSeeded = false;
}
