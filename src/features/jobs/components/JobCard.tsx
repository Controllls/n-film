"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { findUserByNickname } from "@/features/auth/services/users.service";
import { AuthorStars } from "@/features/ratings/components/AuthorStars";
import { computeDDay, dDayLabel, formatElapsed } from "../lib/dday";
import { formatJobText } from "../lib/format";
import { ROLE_LABELS } from "../lib/labels";
import type { Job } from "../types";

type Props = {
  job: Job;
  onApply?: () => void;
  onShare?: () => void;
  onToggleStatus?: () => void;
  onSeeApplicants?: () => void;
  isOwner?: boolean;
  isPreview?: boolean;
};

export function JobCard({
  job,
  onApply,
  onShare,
  onToggleStatus,
  onSeeApplicants,
  isOwner,
  isPreview,
}: Props) {
  const dDay = computeDDay(job.shootDate);
  const elapsed = formatElapsed(job.createdAt);
  const text = formatJobText(job);
  const isClosed = job.status === "closed";

  return (
    <article
      className={cn(
        "rounded-lg border border-line bg-bg p-4 shadow-card",
        isClosed && "opacity-60",
      )}
      aria-label={`${ROLE_LABELS[job.role]} 공고`}
    >
      <header className="mb-3 flex items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-semibold",
              isClosed ? "bg-bg-inset text-ink-soft" : "bg-accent-soft text-accent-strong",
            )}
          >
            {isClosed ? "마감" : dDayLabel(dDay)}
          </span>
          <span className="text-ink-soft">{ROLE_LABELS[job.role]}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-ink-soft">
          {isPreview ? (
            <span className="truncate">{job.authorName} · 미리보기</span>
          ) : (
            <>
              <AuthorLink nickname={job.authorName} />
              <AuthorStars nickname={job.authorName} />
              <span>· {elapsed}</span>
            </>
          )}
        </div>
      </header>

      <pre className="whitespace-pre-wrap break-words font-sans text-[14px] leading-relaxed text-ink">
        {text}
      </pre>

      {!isPreview ? (
        <footer className="mt-4 flex flex-wrap items-center justify-end gap-2">
          {onShare ? (
            <Button variant="ghost" size="md" onClick={onShare}>
              공유
            </Button>
          ) : null}
          {isOwner && onSeeApplicants ? (
            <Button variant="secondary" size="md" onClick={onSeeApplicants}>
              신청자 명단
            </Button>
          ) : null}
          {isOwner && onToggleStatus ? (
            <Button variant="secondary" size="md" onClick={onToggleStatus}>
              {isClosed ? "재오픈" : "마감"}
            </Button>
          ) : null}
          {onApply ? (
            <Button onClick={onApply} disabled={isClosed}>
              신청하기
            </Button>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}

function AuthorLink({ nickname }: { nickname: string }) {
  const q = useQuery({
    queryKey: ["auth", "userByNickname", nickname],
    queryFn: () => findUserByNickname(nickname),
  });
  const loginId = q.data?.loginId;
  if (!loginId) {
    return <span className="truncate font-medium text-ink">{nickname}</span>;
  }
  return (
    <Link
      href={`/u/${loginId}`}
      className="truncate font-medium text-ink hover:underline"
    >
      {nickname}
    </Link>
  );
}
