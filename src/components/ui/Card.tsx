import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  footer?: ReactNode;
};

export function Card({ title, footer, className, children, ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-bg shadow-card",
        "flex flex-col",
        className,
      )}
      {...rest}
    >
      {title ? (
        <div className="border-b border-line px-5 py-4 text-[15px] font-semibold text-ink">
          {title}
        </div>
      ) : null}
      <div className="flex-1 px-5 py-4">{children}</div>
      {footer ? (
        <div className="border-t border-line bg-bg-subtle px-5 py-3 text-[13px] text-ink-muted">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
