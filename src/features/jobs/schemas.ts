import { z } from "zod";

export const RoleSchema = z.enum([
  "directing",
  "camera",
  "lighting",
  "grip",
  "art",
  "sound",
  "makeup",
  "costume",
  "production",
  "data",
  "script",
  "etc",
]);

export const GenderPrefSchema = z.enum(["any", "male", "female"]);

export const ApplyFieldSchema = z.enum([
  "name",
  "age",
  "gender",
  "contact",
  "career",
  "address",
  "physical",
  "license",
  "note",
]);

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `${max}자 이내로 입력해주세요`)
    .transform((v) => {
      const t = v.trim();
      return t === "" ? null : t;
    });

const requiredText = (max: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, `${label}을(를) 입력해주세요`).max(max, `${max}자 이내`));

export const JobInputSchema = z.object({
  role: RoleSchema,
  shootDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식이 올바르지 않습니다"),
  headcount: z.coerce
    .number({ message: "숫자를 입력해주세요" })
    .int("정수만 가능합니다")
    .min(1, "인원은 1명 이상")
    .max(99, "인원은 99명 이하"),
  genderPref: GenderPrefSchema,
  pay: requiredText(100, "페이"),
  transport: optionalText(100),
  callTime: requiredText(100, "콜타임/집합 시간"),
  location: requiredText(100, "집합 장소"),
  endTime: optionalText(100),
  notes: optionalText(500),
  applyFields: z
    .array(ApplyFieldSchema)
    .transform((arr) => (arr.includes("name") ? arr : (["name", ...arr] as typeof arr)))
    .pipe(z.array(ApplyFieldSchema).min(1, "받을 정보를 1개 이상 선택해주세요")),
  authorName: requiredText(40, "작성자 이름"),
});

export type JobInputParsed = z.infer<typeof JobInputSchema>;
