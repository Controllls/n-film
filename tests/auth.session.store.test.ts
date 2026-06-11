import { beforeEach, describe, expect, it } from "vitest";
import { useSessionStore } from "@/features/auth/store/session.store";

describe("session.store", () => {
  beforeEach(() => {
    useSessionStore.getState().logout();
    localStorage.clear();
  });

  it("초기값은 null", () => {
    expect(useSessionStore.getState().currentUserId).toBeNull();
  });

  it("login → currentUserId 설정 + localStorage 영속", () => {
    useSessionStore.getState().login("user-1");
    expect(useSessionStore.getState().currentUserId).toBe("user-1");
    const raw = localStorage.getItem("nfilm:session");
    expect(raw).toBeTruthy();
    if (raw) {
      const parsed = JSON.parse(raw) as { state: { currentUserId: string | null } };
      expect(parsed.state.currentUserId).toBe("user-1");
    }
  });

  it("logout → null 복귀", () => {
    useSessionStore.getState().login("user-1");
    useSessionStore.getState().logout();
    expect(useSessionStore.getState().currentUserId).toBeNull();
  });
});
