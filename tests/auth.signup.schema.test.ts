import { describe, expect, it } from "vitest";
import { SignupSchema } from "@/features/auth/schemas";

const valid = {
  loginId: "abc_123",
  nickname: "홍길동",
  name: "홍길동",
  email: "hong@example.com",
  phone: "010-1234-5678",
  homepage: "",
  birth: "",
  kind: "personal" as const,
  gender: "male" as const,
  notifyEmail: "no" as const,
  agreedTerms: true,
  agreedPrivacy: true,
  invitedById: null,
};

describe("SignupSchema", () => {
  it("정상 입력 통과", () => {
    const r = SignupSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.phone).toBe("010-1234-5678");
      expect(r.data.homepage).toBeNull();
      expect(r.data.birth).toBeNull();
    }
  });

  it("아이디 형식 위반 → 차단", () => {
    const r = SignupSchema.safeParse({ ...valid, loginId: "1abc" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain("영문 시작");
    }
  });

  it("약관 미동의 → 차단", () => {
    const r = SignupSchema.safeParse({ ...valid, agreedTerms: false });
    expect(r.success).toBe(false);
  });

  it("이메일 형식 오류 → 차단", () => {
    const r = SignupSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("선택 필드 공백은 null 로 정규화", () => {
    const r = SignupSchema.safeParse({
      ...valid,
      phone: "",
      homepage: "  ",
      birth: "",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.phone).toBeNull();
      expect(r.data.homepage).toBeNull();
      expect(r.data.birth).toBeNull();
    }
  });
});
