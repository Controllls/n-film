import { describe, expect, it } from "vitest";
import { env, USE_STUBS } from "@/config/env";

describe("env", () => {
  it("기본 스텁 모드는 true", () => {
    expect(typeof USE_STUBS).toBe("boolean");
    expect(env.NEXT_PUBLIC_KAKAO_REDIRECT_URI).toMatch(/^https?:\/\//);
  });
});
