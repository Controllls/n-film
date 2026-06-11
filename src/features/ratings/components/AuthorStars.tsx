"use client";

import { useRatingSummaryByNickname } from "../hooks/useRatings";
import { Stars } from "./Stars";

type Props = { nickname: string };

export function AuthorStars({ nickname }: Props) {
  const { data } = useRatingSummaryByNickname(nickname);
  if (!data) {
    return <span className="text-[12px] text-ink-soft">(평점 없음)</span>;
  }
  if (data.count === 0) {
    return <span className="text-[12px] text-ink-soft">(신규)</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-ink-muted">
      <Stars value={data.average} size="sm" />
      <span>
        {data.average.toFixed(1)} ({data.count})
      </span>
    </span>
  );
}
