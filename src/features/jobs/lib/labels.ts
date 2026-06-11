import type { ApplyField, GenderPref, Role } from "../types";

export const ROLE_LABELS: Record<Role, string> = {
  directing: "연출부",
  camera: "촬영부",
  lighting: "조명부",
  grip: "그립",
  art: "미술/아트팀",
  sound: "동시녹음",
  makeup: "헤어메이크업",
  costume: "의상",
  production: "제작부",
  data: "데이터매니저",
  script: "스크립터",
  etc: "기타",
};

export const ROLE_OPTIONS: { value: Role; label: string }[] = (
  Object.entries(ROLE_LABELS) as [Role, string][]
).map(([value, label]) => ({ value, label }));

export const APPLY_LABELS: Record<ApplyField, string> = {
  name: "성함",
  age: "나이",
  gender: "성별",
  contact: "연락처",
  career: "경력",
  address: "거주지",
  physical: "신체조건",
  license: "운전면허",
  note: "자유메모",
};

export const APPLY_OPTIONS: { value: ApplyField; label: string }[] = (
  Object.entries(APPLY_LABELS) as [ApplyField, string][]
).map(([value, label]) => ({ value, label }));

export const GENDER_SUFFIX: Record<GenderPref, string> = {
  any: "",
  male: "남자",
  female: "여자",
};

export const GENDER_OPTIONS: { value: GenderPref; label: string }[] = [
  { value: "any", label: "무관" },
  { value: "male", label: "남자" },
  { value: "female", label: "여자" },
];
