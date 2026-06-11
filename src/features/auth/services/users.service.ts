"use client";

import type { SignupInput, User } from "../types";

declare global {
  // eslint-disable-next-line no-var
  var __nfilmUsers: Map<string, User> | undefined;
  // eslint-disable-next-line no-var
  var __nfilmUsersSeeded: boolean | undefined;
}

const store: Map<string, User> = (globalThis.__nfilmUsers ??= new Map());

function ulid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const SEED_NICKNAMES = ["김정한", "경원준", "KHJ"] as const;
const SEED_LOGIN_IDS: Record<string, string> = {
  "김정한": "junghan",
  "경원준": "wonjun",
  "KHJ": "khj",
};

export function ensureUsersSeed(): void {
  if (globalThis.__nfilmUsersSeeded) return;
  globalThis.__nfilmUsersSeeded = true;
  if (store.size > 0) return;
  const now = new Date().toISOString();
  for (const nickname of SEED_NICKNAMES) {
    const id = ulid();
    const loginId = SEED_LOGIN_IDS[nickname] ?? nickname.toLowerCase();
    const user: User = {
      id,
      loginId,
      nickname,
      name: nickname,
      email: `${loginId}@seed.local`,
      phone: null,
      homepage: null,
      birth: null,
      kind: "personal",
      gender: "unspecified",
      notifyEmail: "no",
      agreedTermsAt: now,
      agreedPrivacyAt: now,
      createdAt: now,
      invitedById: null,
    };
    store.set(id, user);
  }
}

function findOneByPredicate(predicate: (u: User) => boolean): User | null {
  for (const u of store.values()) if (predicate(u)) return u;
  return null;
}

export async function findUserByNickname(nickname: string): Promise<User | null> {
  ensureUsersSeed();
  return delay(findOneByPredicate((u) => u.nickname === nickname));
}

export async function findUserByLoginId(loginId: string): Promise<User | null> {
  ensureUsersSeed();
  const norm = loginId.trim().toLowerCase();
  return delay(findOneByPredicate((u) => u.loginId === norm));
}

export async function isNicknameTaken(nickname: string): Promise<boolean> {
  ensureUsersSeed();
  return findOneByPredicate((u) => u.nickname === nickname) !== null;
}

export async function isLoginIdTaken(loginId: string): Promise<boolean> {
  ensureUsersSeed();
  const norm = loginId.trim().toLowerCase();
  return findOneByPredicate((u) => u.loginId === norm) !== null;
}

export async function getUserById(id: string): Promise<User | null> {
  ensureUsersSeed();
  return delay(store.get(id) ?? null);
}

export async function createUser(input: SignupInput): Promise<User> {
  ensureUsersSeed();
  if (findOneByPredicate((u) => u.nickname === input.nickname)) {
    throw new Error("이미 사용 중인 닉네임입니다");
  }
  const normLoginId = input.loginId.trim().toLowerCase();
  if (findOneByPredicate((u) => u.loginId === normLoginId)) {
    throw new Error("이미 사용 중인 아이디입니다");
  }
  const now = new Date().toISOString();
  const user: User = {
    id: ulid(),
    loginId: normLoginId,
    nickname: input.nickname,
    name: input.name,
    email: input.email,
    phone: input.phone,
    homepage: input.homepage,
    birth: input.birth,
    kind: input.kind,
    gender: input.gender,
    notifyEmail: input.notifyEmail,
    agreedTermsAt: now,
    agreedPrivacyAt: now,
    createdAt: now,
    invitedById: input.invitedById,
  };
  store.set(user.id, user);
  return delay(user);
}

export function __resetUsersForTest(): void {
  store.clear();
  globalThis.__nfilmUsersSeeded = false;
}
