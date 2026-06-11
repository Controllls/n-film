import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetApplicationsForTest,
  createApplication,
  getApplicationOf,
  listApplicationsByApplicant,
  listApplicationsByJob,
} from "@/features/applications/services/applications.service";
import { __resetUsersForTest } from "@/features/auth/services/users.service";
import { __resetForTest as resetJobs } from "@/features/jobs/services/jobs.service";

describe("applications.service", () => {
  beforeEach(() => {
    __resetApplicationsForTest();
    __resetUsersForTest();
    resetJobs();
  });

  it("createApplication 후 jobId 와 applicantId 로 조회 가능", async () => {
    const app = await createApplication({
      jobId: "j1",
      applicantId: "u1",
      applicantNickname: "테스트",
      data: { name: "테스트", career: "신입" },
    });
    expect(app.id).toBeTruthy();
    const byJob = await listApplicationsByJob("j1");
    expect(byJob).toHaveLength(1);
    const byApp = await listApplicationsByApplicant("u1");
    expect(byApp).toHaveLength(1);
  });

  it("같은 jobId+applicantId 중복 신청 → 한국어 에러", async () => {
    await createApplication({
      jobId: "j1",
      applicantId: "u1",
      applicantNickname: "테스트",
      data: {},
    });
    await expect(
      createApplication({
        jobId: "j1",
        applicantId: "u1",
        applicantNickname: "테스트",
        data: {},
      }),
    ).rejects.toThrow("이미 신청한 공고입니다");
  });

  it("getApplicationOf 는 정확히 단건만 돌려준다", async () => {
    await createApplication({
      jobId: "j1",
      applicantId: "u1",
      applicantNickname: "A",
      data: { name: "A" },
    });
    const found = await getApplicationOf("j1", "u1");
    expect(found?.applicantNickname).toBe("A");
    const none = await getApplicationOf("j1", "uX");
    expect(none).toBeNull();
  });
});
