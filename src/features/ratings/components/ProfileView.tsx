"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui";
import { findUserByLoginId } from "@/features/auth/services/users.service";
import { formatElapsed } from "@/features/jobs/lib/dday";
import { useRatingSummary, useRatingsList } from "../hooks/useRatings";
import { Stars } from "./Stars";

type Props = { loginId: string };

export function ProfileView({ loginId }: Props) {
  const userQ = useQuery({
    queryKey: ["auth", "userByLogin", loginId],
    queryFn: () => findUserByLoginId(loginId),
    enabled: loginId.length > 0,
  });
  const summary = useRatingSummary(userQ.data?.id ?? null);
  const list = useRatingsList(userQ.data?.id ?? null);

  if (userQ.isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }
  if (!userQ.data) {
    return (
      <Card title="사용자를 찾을 수 없습니다">
        <p className="text-[14px] text-ink-muted">
          존재하지 않거나 비공개된 사용자입니다.
        </p>
      </Card>
    );
  }
  const user = userQ.data;
  const s = summary.data ?? { average: 0, count: 0 };
  const ratings = list.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Card title="프로필">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-[18px] font-semibold text-accent-strong">
            {user.nickname.slice(0, 1)}
          </span>
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-ink">{user.nickname}</span>
            <span className="text-[12.5px] text-ink-soft">
              {user.kind === "personal" ? "개인회원" : "사업자회원"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Stars value={s.average} size="md" />
          {s.count === 0 ? (
            <span className="text-[14px] text-ink-soft">아직 평점이 없습니다</span>
          ) : (
            <span className="text-[14px] text-ink">
              {s.average.toFixed(1)} <span className="text-ink-soft">({s.count}개)</span>
            </span>
          )}
        </div>
      </Card>

      <Card title={`받은 평점 ${ratings.length}건`}>
        {ratings.length === 0 ? (
          <p className="text-[14px] text-ink-soft">아직 평점이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ratings.map((r) => (
              <li key={r.id} className="border-b border-line pb-3 last:border-none last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <Stars value={r.stars} size="sm" />
                  <span className="text-[12px] text-ink-soft">
                    {r.raterNickname} · {formatElapsed(r.createdAt)}
                  </span>
                </div>
                {r.review ? (
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink">{r.review}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
