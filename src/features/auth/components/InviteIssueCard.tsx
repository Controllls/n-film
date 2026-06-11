"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { formatElapsed } from "@/features/jobs/lib/dday";
import { useIssueInvite, useMyInvites } from "../hooks/useInvites";
import { getInviteStatusOf } from "../services/invites.service";

type Props = { userId: string };

export function InviteIssueCard({ userId }: Props) {
  const issue = useIssueInvite();
  const invites = useMyInvites(userId);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  function handleIssue() {
    issue.mutate(userId, {
      onSuccess: (t) => {
        const url = `${window.location.origin}/invite/${t.token}`;
        setLastUrl(url);
      },
    });
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      alert("초대 링크가 복사되었습니다.");
    } catch {
      window.prompt("아래 링크를 복사해주세요", url);
    }
  }

  return (
    <Card title="초대 링크">
      <p className="text-[13px] leading-relaxed text-ink-muted">
        엔필름은 지인 추천 가입제입니다. 발급한 링크는 7일간 유효하며 1회만 사용할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={handleIssue} isLoading={issue.isPending}>
          새 초대 링크 발급
        </Button>
        {lastUrl ? (
          <Button variant="secondary" onClick={() => copy(lastUrl)}>
            방금 발급한 링크 복사
          </Button>
        ) : null}
      </div>

      {lastUrl ? (
        <pre className="mt-3 whitespace-pre-wrap break-all rounded border border-line bg-bg-subtle p-2 font-sans text-[12px] text-ink-muted">
          {lastUrl}
        </pre>
      ) : null}

      <div className="mt-5">
        <p className="mb-2 text-[13px] font-semibold text-ink-muted">발급 내역</p>
        {invites.isLoading ? (
          <p className="text-[13px] text-ink-soft">불러오는 중…</p>
        ) : (invites.data ?? []).length === 0 ? (
          <p className="text-[13px] text-ink-soft">아직 발급한 링크가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {(invites.data ?? []).map((t) => {
              const status = getInviteStatusOf(t);
              const label = status === "valid" ? "유효" : status === "used" ? "사용됨" : "만료";
              const tone =
                status === "valid"
                  ? "text-ok"
                  : status === "used"
                    ? "text-ink-soft"
                    : "text-danger";
              return (
                <li key={t.token} className="flex items-center justify-between gap-2 text-[12.5px]">
                  <span className="truncate font-mono text-ink-muted">
                    …{t.token.slice(-8)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className={tone}>{label}</span>
                    <span className="text-ink-soft">{formatElapsed(t.issuedAt)}</span>
                    {status === "valid" ? (
                      <button
                        type="button"
                        className="rounded border border-line px-2 py-0.5 text-ink-muted hover:bg-bg-subtle"
                        onClick={() =>
                          copy(`${window.location.origin}/invite/${t.token}`)
                        }
                      >
                        복사
                      </button>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
