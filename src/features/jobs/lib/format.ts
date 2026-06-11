import type { ApplyField, GenderPref, Role } from "../types";
import { APPLY_LABELS, GENDER_SUFFIX, ROLE_LABELS } from "./labels";

export function formatShootDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [, mm, dd] = parts;
  const m = Number(mm);
  const d = Number(dd);
  if (Number.isNaN(m) || Number.isNaN(d)) return iso;
  return `${m}/${d}`;
}

type Formattable = {
  role: Role;
  shootDate: string;
  headcount: number;
  genderPref: GenderPref;
  pay: string;
  transport: string | null;
  callTime: string;
  location: string;
  endTime: string | null;
  notes: string | null;
  applyFields: ApplyField[];
};

export function formatJobLines(job: Formattable): string[] {
  const lines: string[] = [];
  lines.push(`[${ROLE_LABELS[job.role]} 구인]`);
  lines.push(`날짜 : ${formatShootDate(job.shootDate)}`);
  const genderSuffix = GENDER_SUFFIX[job.genderPref];
  lines.push(`인원 : ${job.headcount}명${genderSuffix ? ` (${genderSuffix})` : ""}`);
  const paySuffix = job.transport ? ` / ${job.transport}` : "";
  lines.push(`페이 : ${job.pay}${paySuffix}`);
  lines.push(`콜타임 : ${job.callTime} ${job.location}`.trim());
  if (job.endTime) lines.push(`종료 : ${job.endTime}`);
  if (job.notes) {
    for (const ln of job.notes.split("\n")) {
      const t = ln.trim();
      if (t) lines.push(`- ${t}`);
    }
  }
  lines.push("");
  const apply = job.applyFields.length
    ? job.applyFields.map((f) => APPLY_LABELS[f]).join(" / ")
    : APPLY_LABELS.name;
  lines.push(`${apply} 부탁드립니다`);
  return lines;
}

export function formatJobText(job: Formattable): string {
  return formatJobLines(job).join("\n");
}
