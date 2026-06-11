"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/cn";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { APPLY_OPTIONS, GENDER_OPTIONS, ROLE_OPTIONS } from "../lib/labels";
import { JobInputSchema } from "../schemas";
import type { ApplyField, GenderPref, Job, Role } from "../types";
import { useCreateJob } from "../hooks/useCreateJob";
import { JobCard } from "./JobCard";

type RawForm = {
  authorName: string;
  role: Role;
  shootDate: string;
  headcount: number;
  genderPref: GenderPref;
  pay: string;
  transport: string;
  callTime: string;
  location: string;
  endTime: string;
  notes: string;
  applyFields: ApplyField[];
};

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function JobForm() {
  const router = useRouter();
  const createJob = useCreateJob();
  const { user } = useCurrentUser();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RawForm>({
    defaultValues: {
      authorName: "",
      role: "directing",
      shootDate: tomorrowISO(),
      headcount: 1,
      genderPref: "any",
      pay: "",
      transport: "",
      callTime: "",
      location: "",
      endTime: "",
      notes: "",
      applyFields: ["career", "age", "contact"],
    },
  });

  useEffect(() => {
    if (user) setValue("authorName", user.nickname);
  }, [user, setValue]);

  const values = watch();

  const previewJob = useMemo<Job>(() => {
    const apply: ApplyField[] = values.applyFields.includes("name")
      ? values.applyFields
      : ["name", ...values.applyFields];
    return {
      id: "preview",
      role: values.role,
      shootDate: values.shootDate || tomorrowISO(),
      headcount: Number(values.headcount) || 1,
      genderPref: values.genderPref,
      pay: values.pay || "(페이)",
      transport: values.transport.trim() === "" ? null : values.transport,
      callTime: values.callTime || "(콜타임)",
      location: values.location || "(장소)",
      endTime: values.endTime.trim() === "" ? null : values.endTime,
      notes: values.notes.trim() === "" ? null : values.notes,
      applyFields: apply,
      status: "open",
      authorName: values.authorName || "(작성자)",
      createdAt: new Date().toISOString(),
    };
  }, [values]);

  const onSubmit = handleSubmit((raw) => {
    setSubmitError(null);
    const parsed = JobInputSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") {
          setError(path as keyof RawForm, { type: "validate", message: issue.message });
        }
      }
      return;
    }
    createJob.mutate(parsed.data, {
      onSuccess: (job) => {
        router.push(`/jobs/${job.id}` as Route);
      },
      onError: (err) => {
        setSubmitError(err instanceof Error ? err.message : "등록 중 오류가 발생했습니다");
      },
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        {user ? (
          <div className="rounded border border-line bg-bg-subtle px-3 py-2 text-[13px] text-ink-muted">
            작성자: <span className="font-semibold text-ink">{user.nickname}</span>
          </div>
        ) : (
          <Input
            label="작성자 이름"
            placeholder="홍길동"
            helper="로그인하면 자동으로 채워집니다."
            error={errors.authorName?.message}
            {...register("authorName")}
          />
        )}

        <Field label="역할/팀" error={errors.role?.message}>
          <select
            {...register("role")}
            className="h-11 w-full rounded border border-line bg-bg px-3 text-[15px] text-ink focus-visible:shadow-focus"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            label="촬영 날짜"
            error={errors.shootDate?.message}
            {...register("shootDate")}
          />
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            label="인원"
            error={errors.headcount?.message}
            {...register("headcount", { valueAsNumber: true })}
          />
        </div>

        <Field label="성별 선호" error={errors.genderPref?.message}>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-line bg-bg px-3 py-2 text-[14px] text-ink-muted has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft has-[:checked]:text-ink"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                  {...register("genderPref")}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>

        <Input
          label="페이"
          placeholder="예: 12/20 오버 +1"
          helper="현장에서 쓰는 표기 그대로 적어주세요."
          error={errors.pay?.message}
          {...register("pay")}
        />
        <Input
          label="교통비 (선택)"
          placeholder="예: 편도 3만, 택 왕복 3"
          error={errors.transport?.message}
          {...register("transport")}
        />
        <Input
          label="콜타임/집합 시간"
          placeholder="예: 0500, 오전 5시, 미정"
          error={errors.callTime?.message}
          {...register("callTime")}
        />
        <Input
          label="집합 장소"
          placeholder="예: 남양주 뭉클스튜디오"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="예상 종료 (선택)"
          placeholder="예: 밤 11시 예상"
          error={errors.endTime?.message}
          {...register("endTime")}
        />

        <Field label="추가 메모 (선택)" error={errors.notes?.message}>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="우대 조건·픽업 정보 등 (줄바꿈으로 항목 구분)"
            className="w-full rounded border border-line bg-bg px-3 py-2 text-[14px] text-ink placeholder:text-ink-soft focus-visible:shadow-focus"
          />
        </Field>

        <Field label="받을 정보" error={errors.applyFields?.message}>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-accent-strong bg-accent-soft px-3 py-1 text-[13px] text-ink">
              성함 (필수)
            </span>
            {APPLY_OPTIONS.filter((o) => o.value !== "name").map((opt) => (
              <label
                key={opt.value}
                className="cursor-pointer rounded-full border border-line bg-bg px-3 py-1 text-[13px] text-ink-muted has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft has-[:checked]:text-ink"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  className="sr-only"
                  {...register("applyFields")}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-semibold text-ink-muted">미리보기 (등록되면 이대로 보입니다)</h2>
        <JobCard job={previewJob} isPreview />
      </section>

      {submitError ? (
        <p role="alert" className="text-[14px] text-danger">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" size="lg" isLoading={createJob.isPending}>
        공고 올리기
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5")}>
      <span className="text-[13px] font-medium text-ink-muted">{label}</span>
      {children}
      {error ? <span className="text-[13px] text-danger">{error}</span> : null}
    </div>
  );
}
