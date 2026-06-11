import type { Gender, NotifyEmail, UserKind } from "../types";

export const KIND_OPTIONS: { value: UserKind; label: string; description: string }[] = [
  { value: "personal", label: "개인회원", description: "개인으로 가입합니다." },
  { value: "business", label: "사업자회원", description: "사업자 정보 기준으로 가입합니다." },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "남자" },
  { value: "female", label: "여자" },
  { value: "unspecified", label: "선택 안 함" },
];

export const NOTIFY_OPTIONS: { value: NotifyEmail; label: string }[] = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
];
