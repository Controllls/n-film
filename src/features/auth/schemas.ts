import { z } from "zod";

const LOGIN_ID_RE = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
const PHONE_RE = /^[0-9\-+\s()]{5,30}$/;
const BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/;

const optionalTrim = (max: number, pattern?: RegExp, patternMsg?: string) =>
  z
    .string()
    .max(max, `${max}자 이내`)
    .optional()
    .transform((v) => {
      const t = (v ?? "").trim();
      return t === "" ? null : t;
    })
    .pipe(
      z
        .string()
        .nullable()
        .superRefine((val, ctx) => {
          if (val === null) return;
          if (pattern && !pattern.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: patternMsg ?? "형식이 올바르지 않습니다",
            });
          }
        }),
    );

export const SignupSchema = z.object({
  loginId: z.string().regex(LOGIN_ID_RE, "영문 시작 · 영문/숫자/_/- 3~20자"),
  nickname: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(2, "2자 이상").max(20, "20자 이내")),
  name: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "이름을 입력해주세요").max(40, "40자 이내")),
  email: z.string().email("이메일 형식이 올바르지 않습니다").max(120, "120자 이내"),
  phone: optionalTrim(30, PHONE_RE, "전화번호 형식이 올바르지 않습니다"),
  homepage: optionalTrim(200),
  birth: optionalTrim(10, BIRTH_RE, "YYYY-MM-DD 형식으로 입력해주세요"),
  kind: z.enum(["personal", "business"]),
  gender: z.enum(["male", "female", "unspecified"]),
  notifyEmail: z.enum(["yes", "no"]),
  agreedTerms: z
    .boolean()
    .refine((v) => v === true, { message: "이용약관에 동의해주세요" }),
  agreedPrivacy: z
    .boolean()
    .refine((v) => v === true, { message: "개인정보 처리방침에 동의해주세요" }),
  invitedById: z.string().nullable(),
});

export type SignupParsed = z.infer<typeof SignupSchema>;
