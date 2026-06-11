"use client";

import type { InviteStatus, InviteToken } from "../types";

declare global {
  // eslint-disable-next-line no-var
  var __nfilmInvites: Map<string, InviteToken> | undefined;
}

const store: Map<string, InviteToken> = (globalThis.__nfilmInvites ??= new Map());

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function randToken(length = 22): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

function delay<T>(value: T, ms = 50): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function issueInvite(issuedById: string): Promise<InviteToken> {
  const now = new Date();
  const token: InviteToken = {
    token: randToken(),
    issuedById,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SEVEN_DAYS_MS).toISOString(),
    usedById: null,
    usedAt: null,
  };
  store.set(token.token, token);
  return delay(token);
}

export function getInviteStatusOf(t: InviteToken): InviteStatus {
  if (t.usedAt) return "used";
  if (new Date(t.expiresAt).getTime() < Date.now()) return "expired";
  return "valid";
}

export type InviteLookup =
  | { status: "missing" }
  | { status: InviteStatus; token: InviteToken };

export async function getInvite(token: string): Promise<InviteLookup> {
  const t = store.get(token);
  if (!t) return delay({ status: "missing" });
  return delay({ status: getInviteStatusOf(t), token: t });
}

export async function listInvitesByIssuer(issuedById: string): Promise<InviteToken[]> {
  const arr = Array.from(store.values()).filter((t) => t.issuedById === issuedById);
  arr.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  return delay(arr);
}

export async function consumeInvite(token: string, usedById: string): Promise<InviteToken> {
  const t = store.get(token);
  if (!t) throw new Error("초대 토큰을 찾을 수 없습니다");
  if (t.usedAt) throw new Error("이미 사용된 초대 토큰입니다");
  if (new Date(t.expiresAt).getTime() < Date.now()) {
    throw new Error("만료된 초대 토큰입니다");
  }
  const next: InviteToken = {
    ...t,
    usedById,
    usedAt: new Date().toISOString(),
  };
  store.set(t.token, next);
  return delay(next);
}

export function __resetInvitesForTest(): void {
  store.clear();
}
