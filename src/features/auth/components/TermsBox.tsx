"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  body: string;
  checked: boolean;
  onCheck: (next: boolean) => void;
  error?: ReactNode;
  agreeLabel?: string;
};

export function TermsBox({ title, body, checked, onCheck, error, agreeLabel }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-ink-muted">{title}</p>
      <pre
        className={cn(
          "max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded border border-line bg-bg-subtle p-3 font-sans text-[12.5px] leading-relaxed text-ink-muted",
        )}
      >
        {body}
      </pre>
      <label className="flex items-center gap-2 text-[13px] text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="h-4 w-4 accent-accent-strong"
        />
        {agreeLabel ?? `${title}에 동의합니다`}
      </label>
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
    </div>
  );
}
