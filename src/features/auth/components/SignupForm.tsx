"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/cn";
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from "../content/terms";
import { GENDER_OPTIONS, KIND_OPTIONS, NOTIFY_OPTIONS } from "../lib/labels";
import { SignupSchema } from "../schemas";
import { useNicknameAvailability, useSignup } from "../hooks/useSignup";
import type { Gender, NotifyEmail, UserKind } from "../types";
import { TermsBox } from "./TermsBox";

type RawForm = {
  loginId: string;
  nickname: string;
  name: string;
  email: string;
  phone: string;
  homepage: string;
  birth: string;
  kind: UserKind;
  gender: Gender;
  notifyEmail: NotifyEmail;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
};

type Props = {
  token: string;
  inviterId: string;
  inviterNickname: string;
};

export function SignupForm({ token, inviterId, inviterNickname }: Props) {
  const router = useRouter();
  const signup = useSignup();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RawForm>({
    defaultValues: {
      loginId: "",
      nickname: "",
      name: "",
      email: "",
      phone: "",
      homepage: "",
      birth: "",
      kind: "personal",
      gender: "unspecified",
      notifyEmail: "no",
      agreedTerms: false,
      agreedPrivacy: false,
    },
  });

  const agreedTerms = watch("agreedTerms");
  const agreedPrivacy = watch("agreedPrivacy");
  const nicknameValue = watch("nickname");

  const [debouncedNickname, setDebouncedNickname] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedNickname(nicknameValue.trim()), 300);
    return () => clearTimeout(t);
  }, [nicknameValue]);

  const nicknameCheck = useNicknameAvailability(debouncedNickname);

  const nicknameHelper = (() => {
    if (debouncedNickname.length < 2) return null;
    if (nicknameCheck.isLoading) return { tone: "muted" as const, text: "확인 중…" };
    if (nicknameCheck.data?.taken)
      return { tone: "danger" as const, text: "이미 사용 중인 닉네임입니다" };
    return { tone: "ok" as const, text: "사용할 수 있는 닉네임입니다" };
  })();

  const onSubmit = handleSubmit((raw) => {
    setSubmitError(null);
    const parsed = SignupSchema.safeParse({ ...raw, invitedById: inviterId });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") {
          setError(path as keyof RawForm, { type: "validate", message: issue.message });
        }
      }
      return;
    }
    if (nicknameCheck.data?.taken) {
      setError("nickname", { type: "validate", message: "이미 사용 중인 닉네임입니다" });
      return;
    }
    signup.mutate(
      { input: parsed.data, token },
      {
        onSuccess: () => router.push("/jobs"),
        onError: (err) =>
          setSubmitError(err instanceof Error ? err.message : "가입 중 오류가 발생했습니다"),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-lg border border-accent-strong/30 bg-accent-soft/50 p-3 text-[13px] text-ink">
        <span className="font-semibold">{inviterNickname}</span> 님이 초대했어요.
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-semibold text-ink">약관 동의 (필수)</h2>
        <TermsBox
          title="이용약관"
          body={TERMS_OF_SERVICE}
          checked={agreedTerms}
          onCheck={(v) => setValue("agreedTerms", v, { shouldValidate: false })}
          error={errors.agreedTerms?.message}
          agreeLabel="이용약관에 동의합니다"
        />
        <TermsBox
          title="개인정보 처리방침"
          body={PRIVACY_POLICY}
          checked={agreedPrivacy}
          onCheck={(v) => setValue("agreedPrivacy", v, { shouldValidate: false })}
          error={errors.agreedPrivacy?.message}
          agreeLabel="개인정보 수집 및 이용에 동의합니다"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-semibold text-ink">기본 정보</h2>
        <Input label="이름" placeholder="홍길동" error={errors.name?.message} {...register("name")} />
        <Input
          label="이메일"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="아이디"
          placeholder="my_id"
          helper="로그인에 쓰입니다. 영문 시작 · 영문/숫자/_/- 3~20자"
          error={errors.loginId?.message}
          {...register("loginId")}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="닉네임"
            placeholder="게시판 등에서 표시되는 이름"
            error={errors.nickname?.message}
            {...register("nickname")}
          />
          {nicknameHelper ? (
            <p
              className={cn(
                "text-[13px]",
                nicknameHelper.tone === "danger" && "text-danger",
                nicknameHelper.tone === "ok" && "text-ok",
                nicknameHelper.tone === "muted" && "text-ink-soft",
              )}
            >
              {nicknameHelper.text}
            </p>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-[14px] font-semibold text-ink">추가 정보 (선택)</h2>
        <Input label="전화번호" placeholder="010-1234-5678" error={errors.phone?.message} {...register("phone")} />
        <Input label="홈페이지" placeholder="포트폴리오/SNS 링크" error={errors.homepage?.message} {...register("homepage")} />
        <Input type="date" label="생일" error={errors.birth?.message} {...register("birth")} />
      </section>

      <FieldGroup label="가입 유형" error={errors.kind?.message}>
        <div className="flex flex-col gap-2">
          {KIND_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer flex-col gap-0.5 rounded border border-line bg-bg p-3 has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft"
            >
              <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
                <input
                  type="radio"
                  value={opt.value}
                  className="h-4 w-4 accent-accent-strong"
                  {...register("kind")}
                />
                {opt.label}
              </span>
              <span className="ml-6 text-[12.5px] text-ink-soft">{opt.description}</span>
            </label>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="성별" error={errors.gender?.message}>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-line bg-bg px-3 py-2 text-[14px] text-ink-muted has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft has-[:checked]:text-ink"
            >
              <input type="radio" value={opt.value} className="sr-only" {...register("gender")} />
              {opt.label}
            </label>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="메일링 수신" error={errors.notifyEmail?.message}>
        <div className="flex gap-2">
          {NOTIFY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded border border-line bg-bg px-3 py-2 text-[14px] text-ink-muted has-[:checked]:border-accent-strong has-[:checked]:bg-accent-soft has-[:checked]:text-ink"
            >
              <input type="radio" value={opt.value} className="sr-only" {...register("notifyEmail")} />
              {opt.label}
            </label>
          ))}
        </div>
      </FieldGroup>

      {submitError ? (
        <p role="alert" className="text-[14px] text-danger">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" size="lg" isLoading={signup.isPending}>
        가입하기
      </Button>
    </form>
  );
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink-muted">{label}</span>
      {children}
      {error ? <span className="text-[13px] text-danger">{error}</span> : null}
    </div>
  );
}
