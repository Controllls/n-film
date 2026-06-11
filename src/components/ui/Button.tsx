import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded font-medium select-none " +
  "transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
  "focus:outline-none focus-visible:shadow-focus";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-ink-inverse hover:bg-accent-strong",
  secondary: "bg-bg-subtle text-ink hover:bg-bg-inset border border-line",
  ghost: "bg-transparent text-ink hover:bg-bg-subtle",
  danger: "bg-danger text-ink-inverse hover:opacity-90",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-[15px] min-w-[44px]",
  lg: "h-12 px-5 text-base min-w-[44px]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", isLoading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {isLoading ? "처리 중…" : children}
    </button>
  );
});
