"use client";

import Link from "next/link";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function AuthAvatar() {
  const { user, hydrated } = useCurrentUser();

  if (!hydrated) {
    return <span className="h-7 w-16" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded px-2 py-1 text-[13px] font-medium text-ink-muted hover:bg-bg-subtle"
      >
        로그인
      </Link>
    );
  }

  return (
    <Link
      href="/me"
      className="flex items-center gap-1.5 rounded px-2 py-1 text-[13px] text-ink hover:bg-bg-subtle"
    >
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-strong"
      >
        {user.nickname.slice(0, 1)}
      </span>
      <span className="max-w-[80px] truncate font-medium">{user.nickname}</span>
    </Link>
  );
}
