import { describe, expect, it } from "vitest";
import { computeDDay, dDayLabel } from "@/features/jobs/lib/dday";

describe("computeDDay / dDayLabel", () => {
  const today = new Date("2026-06-10T12:34:00");

  it("내일 = D-1", () => {
    expect(computeDDay("2026-06-11", today)).toBe(1);
    expect(dDayLabel(1)).toBe("D-1");
  });

  it("오늘 = 오늘", () => {
    expect(computeDDay("2026-06-10", today)).toBe(0);
    expect(dDayLabel(0)).toBe("오늘");
  });

  it("어제 = 지남", () => {
    expect(computeDDay("2026-06-09", today)).toBe(-1);
    expect(dDayLabel(-1)).toBe("1일 지남");
  });
});
