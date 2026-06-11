import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AuthAvatar } from "@/features/auth/components/AuthAvatar";

type Props = {
  children: ReactNode;
  back?: { href: Route; label?: string };
  title?: ReactNode;
  action?: ReactNode;
  hideAvatar?: boolean;
  className?: string;
};

export function MobileShell({
  children,
  back,
  title,
  action,
  hideAvatar,
  className,
}: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-bg">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          {back ? (
            <Link
              href={back.href}
              className="rounded px-1.5 py-1 text-[13px] text-ink-muted hover:bg-bg-subtle"
            >
              ← {back.label ?? "뒤로"}
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
              <span className="text-[15px] font-semibold tracking-tight text-ink">엔필름</span>
            </Link>
          )}
          {title ? (
            <span className="truncate text-[13px] text-ink-muted">{title}</span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {action}
          {hideAvatar ? null : <AuthAvatar />}
        </div>
      </header>
      <div className={cn("flex flex-1 flex-col gap-4 px-4 py-4", className)}>{children}</div>
    </main>
  );
}
