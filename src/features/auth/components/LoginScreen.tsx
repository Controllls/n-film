"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useLogin } from "../hooks/useLogin";

export function LoginScreen() {
  const router = useRouter();
  const login = useLogin();
  const [expanded, setExpanded] = useState(false);
  const [nickname, setNickname] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate(nickname, {
      onSuccess: () => router.push("/jobs"),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 py-4 text-center">
        <h1 className="text-[22px] font-semibold text-ink">엔필름</h1>
        <p className="text-[14px] leading-relaxed text-ink-muted">
          카카오 계정으로 시작하세요.
          <br />
          가입은 지인의 초대 링크가 있어야 가능합니다.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#FEE500] text-[15px] font-semibold text-[#3C1E1E] hover:opacity-90"
      >
        <span aria-hidden>💬</span> 카카오로 시작
      </button>

      {expanded ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-line bg-bg-subtle p-4">
          <p className="text-[12.5px] text-ink-muted">
            (스텁 모드) 카카오 계정에 연결된 닉네임을 입력해주세요. 실 카카오 연동은 키 발급 후
            같은 인터페이스로 교체됩니다.
          </p>
          <Input
            label="닉네임"
            placeholder="예: 김정한"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            error={login.isError ? (login.error as Error).message : undefined}
          />
          <Button type="submit" size="lg" isLoading={login.isPending}>
            로그인
          </Button>
          <p className="text-[12px] text-ink-soft">
            데모: <code>김정한</code> · <code>경원준</code> · <code>KHJ</code> 셋 중 하나로 즉시
            로그인 가능합니다.
          </p>
        </form>
      ) : null}
    </div>
  );
}
