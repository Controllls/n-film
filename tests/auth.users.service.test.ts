import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetUsersForTest,
  createUser,
  ensureUsersSeed,
  findUserByNickname,
  isLoginIdTaken,
  isNicknameTaken,
} from "@/features/auth/services/users.service";
import type { SignupInput } from "@/features/auth/types";

const baseInput: SignupInput = {
  loginId: "testuser",
  nickname: "테스트",
  name: "테스트",
  email: "test@example.com",
  phone: null,
  homepage: null,
  birth: null,
  kind: "personal",
  gender: "unspecified",
  notifyEmail: "no",
  invitedById: null,
};

describe("users.service (인메모리)", () => {
  beforeEach(() => {
    __resetUsersForTest();
  });

  it("시드 사용자 3명(김정한·경원준·KHJ)을 자동 생성한다", async () => {
    ensureUsersSeed();
    expect(await findUserByNickname("김정한")).not.toBeNull();
    expect(await findUserByNickname("경원준")).not.toBeNull();
    expect(await findUserByNickname("KHJ")).not.toBeNull();
  });

  it("createUser 후 닉네임/아이디로 찾을 수 있다", async () => {
    const u = await createUser(baseInput);
    expect(u.id).toBeTruthy();
    expect(await findUserByNickname("테스트")).toEqual(u);
    expect(await isLoginIdTaken("TESTUSER")).toBe(true);
  });

  it("닉네임 중복 시 한국어 에러", async () => {
    await createUser(baseInput);
    await expect(createUser({ ...baseInput, loginId: "x_other" })).rejects.toThrow(
      "이미 사용 중인 닉네임입니다",
    );
  });

  it("아이디 중복 시 한국어 에러", async () => {
    await createUser(baseInput);
    await expect(
      createUser({ ...baseInput, nickname: "다른사람" }),
    ).rejects.toThrow("이미 사용 중인 아이디입니다");
  });

  it("isNicknameTaken 은 시드 닉네임 인식", async () => {
    expect(await isNicknameTaken("김정한")).toBe(true);
    expect(await isNicknameTaken("없는닉")).toBe(false);
  });
});
