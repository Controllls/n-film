import { describe, expect, it } from "vitest";
import { formatJobLines, formatJobText } from "@/features/jobs/lib/format";
import type { Job } from "@/features/jobs/types";

const base: Job = {
  id: "test",
  role: "directing",
  shootDate: "2026-06-11",
  headcount: 1,
  genderPref: "male",
  pay: "12/20 오1 택1.5",
  transport: null,
  callTime: "오전 5시",
  location: "남양주 뭉클스튜디오",
  endTime: "밤 11시 예상",
  notes: "사무실 집합이 아니라 현장집합\n동부권 거주자 우대",
  applyFields: ["name", "career", "age", "contact"],
  status: "open",
  authorName: "김정한",
  createdAt: new Date().toISOString(),
};

describe("formatJobLines", () => {
  it("카톡 양식의 헤더와 핵심 라인을 생성한다", () => {
    const lines = formatJobLines(base);
    expect(lines[0]).toBe("[연출부 구인]");
    expect(lines).toContain("날짜 : 6/11");
    expect(lines).toContain("인원 : 1명 (남자)");
    expect(lines).toContain("페이 : 12/20 오1 택1.5");
    expect(lines).toContain("콜타임 : 오전 5시 남양주 뭉클스튜디오");
    expect(lines).toContain("종료 : 밤 11시 예상");
    expect(lines).toContain("- 사무실 집합이 아니라 현장집합");
    expect(lines).toContain("- 동부권 거주자 우대");
    expect(lines[lines.length - 1]).toBe("성함 / 경력 / 나이 / 연락처 부탁드립니다");
  });

  it("genderPref=any 면 성별 괄호를 생략한다", () => {
    const text = formatJobText({ ...base, genderPref: "any" });
    expect(text).toContain("인원 : 1명\n");
    expect(text).not.toContain("(남자)");
  });

  it("transport 가 있으면 페이 라인에 / 로 붙는다", () => {
    const text = formatJobText({ ...base, transport: "택 왕복 3" });
    expect(text).toContain("페이 : 12/20 오1 택1.5 / 택 왕복 3");
  });

  it("notes 가 없으면 - 줄을 추가하지 않는다", () => {
    const lines = formatJobLines({ ...base, notes: null });
    expect(lines.find((l) => l.startsWith("- "))).toBeUndefined();
  });
});
