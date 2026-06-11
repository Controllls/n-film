"use client";

import { cn } from "@/lib/cn";

type Props = {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Stars({ value, size = "sm", className }: Props) {
  const rounded = Math.round(value * 2) / 2;
  const sizeClass = size === "lg" ? "text-[18px]" : size === "md" ? "text-[15px]" : "text-[13px]";
  return (
    <span
      aria-label={`별점 ${value.toFixed(1)} / 5`}
      className={cn("inline-flex items-center gap-0.5", sizeClass, className)}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        const half = !filled && i - 0.5 === rounded;
        return (
          <span
            key={i}
            className={cn(
              "leading-none",
              filled || half ? "text-accent-strong" : "text-line",
            )}
          >
            {filled ? "★" : half ? "★" : "☆"}
          </span>
        );
      })}
    </span>
  );
}
