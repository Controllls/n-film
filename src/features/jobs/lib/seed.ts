import type { JobInput } from "../types";

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getSeedJobs(): JobInput[] {
  return [
    {
      role: "directing",
      shootDate: offsetDate(1),
      headcount: 1,
      genderPref: "male",
      pay: "12/20 오1 택1.5",
      transport: null,
      callTime: "오전 5시",
      location: "남양주 뭉클스튜디오",
      endTime: "밤 11시 예상",
      notes: "사무실 집합이 아니라 현장집합입니다.\n동부권 거주자 우대",
      applyFields: ["name", "career", "age", "contact"],
      authorName: "김정한",
    },
    {
      role: "directing",
      shootDate: offsetDate(1),
      headcount: 1,
      genderPref: "any",
      pay: "12/20 +1",
      transport: "택 왕복 3",
      callTime: "콜 7시",
      location: "강남 덕션",
      endTime: "엔드 1시 예상 (서울)",
      notes: null,
      applyFields: ["name", "age", "career"],
      authorName: "경원준",
    },
    {
      role: "art",
      shootDate: offsetDate(-1),
      headcount: 2,
      genderPref: "any",
      pay: "12/20 +1",
      transport: null,
      callTime: "오후 1시",
      location: "성수동 스튜디오",
      endTime: "밤 11시 종료",
      notes: "(어제 촬영 종료된 시드 공고 — 평점 데모용)",
      applyFields: ["name", "age", "gender", "contact", "career"],
      authorName: "KHJ",
    },
  ];
}
