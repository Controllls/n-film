import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, helper, error, id, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const describedBy = error
    ? `${inputId}-error`
    : helper
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-[13px] font-medium text-ink-muted">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded border bg-bg px-3 text-[15px] text-ink",
          "placeholder:text-ink-soft",
          "focus:outline-none focus-visible:shadow-focus",
          error ? "border-danger" : "border-line hover:border-line-strong",
          className,
        )}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      ) : helper ? (
        <p id={`${inputId}-helper`} className="text-[13px] text-ink-soft">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
