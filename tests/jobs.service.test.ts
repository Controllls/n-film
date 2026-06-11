import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetForTest,
  createJob,
  getJob,
  listJobs,
  toggleJobStatus,
} from "@/features/jobs/services/jobs.service";
import type { JobInput } from "@/features/jobs/types";

const sample: JobInput = {
  role: "camera",
  shootDate: "2026-06-12",
  headcount: 2,
  genderPref: "any",
  pay: "12/22",
  transport: null,
  callTime: "0700",
  location: "상암",
  endTime: null,
  notes: null,
  applyFields: ["name", "career"],
  authorName: "테스트",
};

describe("jobs.service (인메모리)", () => {
  beforeEach(() => {
    __resetForTest();
  });

  it("createJob → listJobs 에 노출된다", async () => {
    const created = await createJob(sample);
    const list = await listJobs();
    expect(list.find((j) => j.id === created.id)).toBeTruthy();
    expect(created.status).toBe("open");
  });

  it("getJob 으로 단건 조회된다", async () => {
    const created = await createJob(sample);
    const fetched = await getJob(created.id);
    expect(fetched?.id).toBe(created.id);
    expect(fetched?.pay).toBe("12/22");
  });

  it("toggleJobStatus 가 open ↔ closed 를 전환한다", async () => {
    const created = await createJob(sample);
    const closed = await toggleJobStatus(created.id);
    expect(closed.status).toBe("closed");
    const reopened = await toggleJobStatus(created.id);
    expect(reopened.status).toBe("open");
  });

  it("존재하지 않는 id 토글은 한국어 에러를 던진다", async () => {
    await expect(toggleJobStatus("nope")).rejects.toThrow("공고를 찾을 수 없습니다");
  });

  it("첫 listJobs 호출에서 샘플 시드가 채워진다", async () => {
    const list = await listJobs();
    expect(list.length).toBeGreaterThanOrEqual(3);
  });

  it("open 이 closed 보다 먼저 정렬된다", async () => {
    const a = await createJob({ ...sample, shootDate: "2026-06-13" });
    await toggleJobStatus(a.id);
    await createJob({ ...sample, shootDate: "2026-06-14" });
    const list = await listJobs();
    const opens = list.filter((j) => j.status === "open");
    const closeds = list.filter((j) => j.status === "closed");
    const lastOpenIdx = list.findIndex((j) => j === opens[opens.length - 1]);
    const firstClosedIdx = list.findIndex((j) => j === closeds[0]);
    expect(lastOpenIdx).toBeLessThan(firstClosedIdx);
  });
});
