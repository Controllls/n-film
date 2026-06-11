"use client";

import { cn } from "@/lib/cn";
import { ROLE_OPTIONS } from "../lib/labels";
import type { Role } from "../types";

type Props = {
  selectedRoles: Role[];
  showClosed: boolean;
  onToggleRole: (role: Role) => void;
  onClearRoles: () => void;
  onToggleShowClosed: () => void;
};

export function FeedFilters({
  selectedRoles,
  showClosed,
  onToggleRole,
  onClearRoles,
  onToggleShowClosed,
}: Props) {
  const allSelected = selectedRoles.length === 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="역할 필터">
        <Chip active={allSelected} onClick={onClearRoles}>
          전체
        </Chip>
        {ROLE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            active={selectedRoles.includes(opt.value)}
            onClick={() => onToggleRole(opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
      <label className="flex items-center gap-1.5 text-[13px] text-ink-muted">
        <input
          type="checkbox"
          checked={showClosed}
          onChange={onToggleShowClosed}
          className="h-4 w-4 accent-accent-strong"
        />
        마감 공고 포함
      </label>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-[13px] transition-colors",
        active
          ? "border-accent-strong bg-accent text-ink-inverse"
          : "border-line bg-bg text-ink-muted hover:bg-bg-subtle",
      )}
    >
      {children}
    </button>
  );
}
