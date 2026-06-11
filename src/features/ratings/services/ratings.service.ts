"use client";

import {
  ensureUsersSeed,
  findUserByNickname,
} from "@/features/auth/services/users.service";
import {
  getApplicationOf,
  listApplicationsByJob,
} from "@/features/applications/services/applications.service";
import { getJob, listJobs } from "@/features/jobs/services/jobs.service";
import type { CanRateResult, Rating, RatingInput, RatingSummary } from "../types";

declare global {
  // eslint-disable-next-line no-var
  var __nfilmRatings: Map<string, Rating> | undefined;
  // eslint-disable-next-line no-var
  var __nfilmRatingsSeeded: boolean | undefined;
}

const store: Map<string, Rating> = (globalThis.__nfilmRatings ??= new Map());

function ulid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function delay<T>(value: T, ms = 50): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function findCombo(raterId: string, rateeId: string, jobId: string): Rating | null {
  for (const r of store.values()) {
    if (r.raterId === raterId && r.rateeId === rateeId && r.jobId === jobId) return r;
  }
  return null;
}

async function ensureSeed(): Promise<void> {
  if (globalThis.__nfilmRatingsSeeded) return;
  globalThis.__nfilmRatingsSeeded = true;
  if (store.size > 0) return;
  ensureUsersSeed();
  const jobs = await listJobs();
  const khjJob = jobs.find((j) => j.authorName === "KHJ");
  const kim = await findUserByNickname("김정한");
  const khj = await findUserByNickname("KHJ");
  if (!khjJob || !kim || !khj) return;
  const apps = await listApplicationsByJob(khjJob.id);
  if (apps.length === 0) return;
  const now = new Date(Date.now() - 6 * 60 * 60_000).toISOString();
  const r1: Rating = {
    id: ulid(),
    raterId: khj.id,
    raterNickname: khj.nickname,
    rateeId: kim.id,
    rateeNickname: kim.nickname,
    jobId: khjJob.id,
    stars: 5,
    review: "시간 잘 지키시고 현장 매너 최고였습니다.",
    createdAt: now,
  };
  const r2: Rating = {
    id: ulid(),
    raterId: kim.id,
    raterNickname: kim.nickname,
    rateeId: khj.id,
    rateeNickname: khj.nickname,
    jobId: khjJob.id,
    stars: 4,
    review: "콜시트 정확하고 페이 정산도 깔끔했습니다.",
    createdAt: now,
  };
  store.set(r1.id, r1);
  store.set(r2.id, r2);
}

export async function createRating(input: RatingInput): Promise<Rating> {
  await ensureSeed();
  if (input.raterId === input.rateeId) throw new Error("자기 자신은 평가할 수 없습니다");
  if (!Number.isInteger(input.stars) || input.stars < 1 || input.stars > 5) {
    throw new Error("별점은 1~5 사이 정수여야 합니다");
  }
  if (findCombo(input.raterId, input.rateeId, input.jobId)) {
    throw new Error("이미 평점을 남겼습니다");
  }
  const rating: Rating = {
    ...input,
    id: ulid(),
    createdAt: new Date().toISOString(),
  };
  store.set(rating.id, rating);
  return delay(rating);
}

export async function listRatingsFor(rateeId: string): Promise<Rating[]> {
  await ensureSeed();
  const arr = Array.from(store.values()).filter((r) => r.rateeId === rateeId);
  arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return delay(arr);
}

export async function summaryFor(rateeId: string): Promise<RatingSummary> {
  await ensureSeed();
  const arr = Array.from(store.values()).filter((r) => r.rateeId === rateeId);
  if (arr.length === 0) return delay({ average: 0, count: 0 });
  const sum = arr.reduce((a, r) => a + r.stars, 0);
  return delay({ average: sum / arr.length, count: arr.length });
}

export async function summaryForNickname(nickname: string): Promise<RatingSummary> {
  await ensureSeed();
  const arr = Array.from(store.values()).filter((r) => r.rateeNickname === nickname);
  if (arr.length === 0) return delay({ average: 0, count: 0 });
  const sum = arr.reduce((a, r) => a + r.stars, 0);
  return delay({ average: sum / arr.length, count: arr.length });
}

export async function canRate(args: {
  raterId: string;
  raterNickname: string;
  rateeId: string;
  rateeNickname: string;
  jobId: string;
}): Promise<CanRateResult> {
  await ensureSeed();
  if (args.raterId === args.rateeId) {
    return { ok: false, reason: "자기 자신은 평가할 수 없습니다" };
  }
  const job = await getJob(args.jobId);
  if (!job) return { ok: false, reason: "공고를 찾을 수 없습니다" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shoot = new Date(`${job.shootDate}T00:00:00`);
  if (shoot.getTime() > today.getTime()) {
    return { ok: false, reason: "촬영 후에 평점을 남길 수 있습니다" };
  }

  const raterIsAuthor = job.authorName === args.raterNickname;
  const rateeIsAuthor = job.authorName === args.rateeNickname;
  if (raterIsAuthor === rateeIsAuthor) {
    return { ok: false, reason: "함께 일한 기록이 없습니다" };
  }
  const applicantId = raterIsAuthor ? args.rateeId : args.raterId;
  const app = await getApplicationOf(args.jobId, applicantId);
  if (!app) return { ok: false, reason: "함께 일한 기록이 없습니다" };

  if (findCombo(args.raterId, args.rateeId, args.jobId)) {
    return { ok: false, reason: "이미 평점을 남겼습니다" };
  }
  return { ok: true };
}

export function __resetRatingsForTest(): void {
  store.clear();
  globalThis.__nfilmRatingsSeeded = false;
}
