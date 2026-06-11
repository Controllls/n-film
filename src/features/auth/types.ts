export type UserKind = "personal" | "business";
export type Gender = "male" | "female" | "unspecified";
export type NotifyEmail = "yes" | "no";

export type User = {
  id: string;
  loginId: string;
  nickname: string;
  name: string;
  email: string;
  phone: string | null;
  homepage: string | null;
  birth: string | null;
  kind: UserKind;
  gender: Gender;
  notifyEmail: NotifyEmail;
  agreedTermsAt: string;
  agreedPrivacyAt: string;
  createdAt: string;
  invitedById: string | null;
};

export type SignupInput = {
  loginId: string;
  nickname: string;
  name: string;
  email: string;
  phone: string | null;
  homepage: string | null;
  birth: string | null;
  kind: UserKind;
  gender: Gender;
  notifyEmail: NotifyEmail;
  invitedById: string | null;
};

export type InviteToken = {
  token: string;
  issuedById: string;
  issuedAt: string;
  expiresAt: string;
  usedById: string | null;
  usedAt: string | null;
};

export type InviteStatus = "valid" | "expired" | "used" | "missing";
