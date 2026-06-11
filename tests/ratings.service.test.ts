import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetApplicationsForTest,
  createApplication,
} from "@/features/applications/services/applications.service";
import { __resetUsersForTest, createUser } from "@/features/auth/services/users.service";
import {
  __resetForTest as resetJobs,
  createJob,
} from "@/features/jobs/services/jobs.service";
import {
  __resetRatingsForTest,
  canRate,
  createRating,
  summaryFor,
} from "@/features/ratings/services/ratings.service";
import type { SignupInput } from "@/features/auth/types";
import type { JobInput } from "@/features/jobs/types";

function userInput(loginId: string, nickname: string): SignupInput {
  return {
    loginId,
    nickname,
    name: nickname,
    email: `${loginId}@x.com`,
    phone: null,
    homepage: null,
    birth: null,
    kind: "personal",
    gender: "unspecified",
    notifyEmail: "no",
    invitedById: null,
  };
}

function pastJob(nickname: string): JobInput {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return {
    role: "directing",
    shootDate: d.toISOString().slice(0, 10),
    headcount: 1,
    genderPref: "any",
    pay: "12/20",
    transport: null,
    callTime: "0700",
    location: "상암",
    endTime: null,
    notes: null,
    applyFields: ["name"],
    authorName: nickname,
  };
}

describe("ratings.service", () => {
  beforeEach(() => {
    __resetRatingsForTest();
    __resetApplicationsForTest();
    __resetUsersForTest();
    resetJobs();
  });

  it("정상 경로: 작성자가 자기 공고의 신청자에게 평점 가능", async () => {
    const author = await createUser(userInput("author1", "감독A"));
    const applicant = await createUser(userInput("worker1", "스태프B"));
    const job = await createJob(pastJob("감독A"));
    await createApplication({
      jobId: job.id,
      applicantId: applicant.id,
      applicantNickname: applicant.nickname,
      data: {},
    });
    const can = await canRate({
      raterId: author.id,
      raterNickname: author.nickname,
      rateeId: applicant.id,
      rateeNickname: applicant.nickname,
      jobId: job.id,
    });
    expect(can.ok).toBe(true);
    const r = await createRating({
      raterId: author.id,
      raterNickname: author.nickname,
      rateeId: applicant.id,
      rateeNickname: applicant.nickname,
      jobId: job.id,
      stars: 5,
      review: "좋았어요",
    });
    expect(r.stars).toBe(5);
    const s = await summaryFor(applicant.id);
    expect(s.average).toBe(5);
    expect(s.count).toBe(1);
  });

  it("자기 자신은 평가 불가", async () => {
    const u = await createUser(userInput("self1", "본인"));
    const job = await createJob(pastJob("본인"));
    const can = await canRate({
      raterId: u.id,
      raterNickname: u.nickname,
      rateeId: u.id,
      rateeNickname: u.nickname,
      jobId: job.id,
    });
    expect(can.ok).toBe(false);
  });

  it("미래 공고는 평가 불가", async () => {
    const author = await createUser(userInput("future1", "미래감독"));
    const applicant = await createUser(userInput("future2", "미래스태프"));
    const futureJob: JobInput = {
      ...pastJob("미래감독"),
      shootDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toISOString().slice(0, 10);
      })(),
    };
    const job = await createJob(futureJob);
    await createApplication({
      jobId: job.id,
      applicantId: applicant.id,
      applicantNickname: applicant.nickname,
      data: {},
    });
    const can = await canRate({
      raterId: author.id,
      raterNickname: author.nickname,
      rateeId: applicant.id,
      rateeNickname: applicant.nickname,
      jobId: job.id,
    });
    expect(can.ok).toBe(false);
    if (!can.ok) expect(can.reason).toContain("촬영 후");
  });

  it("신청 기록 없으면 평가 불가", async () => {
    const author = await createUser(userInput("a1", "감독X"));
    const stranger = await createUser(userInput("s1", "행인"));
    const job = await createJob(pastJob("감독X"));
    const can = await canRate({
      raterId: author.id,
      raterNickname: author.nickname,
      rateeId: stranger.id,
      rateeNickname: stranger.nickname,
      jobId: job.id,
    });
    expect(can.ok).toBe(false);
  });

  it("같은 (rater,ratee,job) 조합 두 번째 평점 차단", async () => {
    const author = await createUser(userInput("a2", "감독Y"));
    const applicant = await createUser(userInput("w2", "스태프Y"));
    const job = await createJob(pastJob("감독Y"));
    await createApplication({
      jobId: job.id,
      applicantId: applicant.id,
      applicantNickname: applicant.nickname,
      data: {},
    });
    await createRating({
      raterId: author.id,
      raterNickname: author.nickname,
      rateeId: applicant.id,
      rateeNickname: applicant.nickname,
      jobId: job.id,
      stars: 3,
      review: null,
    });
    await expect(
      createRating({
        raterId: author.id,
        raterNickname: author.nickname,
        rateeId: applicant.id,
        rateeNickname: applicant.nickname,
        jobId: job.id,
        stars: 5,
        review: "다시",
      }),
    ).rejects.toThrow("이미 평점을 남겼습니다");
  });
});
