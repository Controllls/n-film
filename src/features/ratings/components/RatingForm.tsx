"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCreateRating } from "../hooks/useRatings";
import type { RatingInput } from "../types";

type Props = {
  base: Omit<RatingInput, "stars" | "review">;
  onDone?: () => void;
};

export function RatingForm({ base, onDone }: Props) {
  const create = useCreateRating();
  const [stars, setStars] = useState<number>(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (stars < 1 || stars > 5) {
      setError("별점을 선택해주세요 (1~5)");
      return;
    }
    if (review.length > 100) {
      setError("후기는 100자 이내로 입력해주세요");
      return;
    }
    create.mutate(
      {
        ...base,
        stars,
        review: review.trim() === "" ? null : review.trim(),
      },
      {
        onSuccess: () => {
          setStars(0);
          setReview("");
          onDone?.();
        },
        onError: (e) => setError(e instanceof Error ? e.message : "오류가 발생했습니다"),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded border border-line bg-bg-subtle p-3">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="별점">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={stars === i}
            onClick={() => setStars(i)}
            className={cn(
              "text-[22px] leading-none transition-colors",
              i <= stars ? "text-accent-strong" : "text-line hover:text-accent",
            )}
          >
            {i <= stars ? "★" : "☆"}
          </button>
        ))}
        {stars > 0 ? (
          <span className="ml-2 text-[13px] text-ink-muted">{stars} / 5</span>
        ) : (
          <span className="ml-2 text-[13px] text-ink-soft">별점 선택</span>
        )}
      </div>
      <textarea
        rows={2}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="한 줄 후기 (선택, 100자 이내)"
        maxLength={120}
        className="w-full rounded border border-line bg-bg px-3 py-2 text-[14px] text-ink placeholder:text-ink-soft focus-visible:shadow-focus"
      />
      {error ? <p className="text-[13px] text-danger">{error}</p> : null}
      <Button type="submit" isLoading={create.isPending}>
        평점 남기기
      </Button>
    </form>
  );
}
