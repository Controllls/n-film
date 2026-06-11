"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { Stars } from "@/features/ratings/components/Stars";
import { useRatingSummary } from "@/features/ratings/hooks/useRatings";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useLogin";
import { InviteIssueCard } from "./InviteIssueCard";

export function MyPage() {
  const router = useRouter();
  const { user, hydrated, isLoading } = useCurrentUser();
  const logout = useLogout();

  useEffect(() => {
    if (hydrated && !isLoading && !user) {
      router.replace("/login");
    }
  }, [hydrated, isLoading, user, router]);

  if (!hydrated || isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }

  if (!user) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">이동 중…</p>;
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const kindLabel = user.kind === "personal" ? "개인회원" : "사업자회원";

  return <MyPageBody userId={user.id} loginId={user.loginId} nickname={user.nickname} name={user.name} email={user.email} kindLabel={kindLabel} onLogout={handleLogout} />;
}

function MyPageBody({
  userId,
  loginId,
  nickname,
  name,
  email,
  kindLabel,
  onLogout,
}: {
  userId: string;
  loginId: string;
  nickname: string;
  name: string;
  email: string;
  kindLabel: string;
  onLogout: () => void;
}) {
  const summary = useRatingSummary(userId);
  const s = summary.data ?? { average: 0, count: 0 };
  return (
    <div className="flex flex-col gap-4">
      <Card title="프로필">
        <div className="flex items-center gap-2">
          <Stars value={s.average} size="md" />
          {s.count === 0 ? (
            <span className="text-[13px] text-ink-soft">평점 없음</span>
          ) : (
            <span className="text-[13px] text-ink">
              {s.average.toFixed(1)} <span className="text-ink-soft">({s.count}개)</span>
            </span>
          )}
        </div>
        <dl className="mt-3 grid grid-cols-[80px_1fr] gap-y-1.5 text-[13.5px]">
          <dt className="text-ink-soft">닉네임</dt>
          <dd className="text-ink">{nickname}</dd>
          <dt className="text-ink-soft">아이디</dt>
          <dd className="font-mono text-ink">{loginId}</dd>
          <dt className="text-ink-soft">이름</dt>
          <dd className="text-ink">{name}</dd>
          <dt className="text-ink-soft">이메일</dt>
          <dd className="break-all text-ink">{email}</dd>
          <dt className="text-ink-soft">유형</dt>
          <dd className="text-ink">{kindLabel}</dd>
        </dl>
        <div className="mt-3 flex gap-2">
          <Link href={`/u/${loginId}`}>
            <Button variant="ghost" size="md">
              공개 프로필 보기
            </Button>
          </Link>
          <Link href="/me/applications">
            <Button variant="ghost" size="md">
              내 신청 내역
            </Button>
          </Link>
        </div>
      </Card>

      <InviteIssueCard userId={userId} />

      <Button variant="secondary" onClick={onLogout}>
        로그아웃
      </Button>
    </div>
  );
}
