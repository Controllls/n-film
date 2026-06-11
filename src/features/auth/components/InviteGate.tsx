"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { getUserById } from "../services/users.service";
import { useInvite } from "../hooks/useInvites";
import { useQuery } from "@tanstack/react-query";
import { SignupForm } from "./SignupForm";

type Props = { token: string };

export function InviteGate({ token }: Props) {
  const invite = useInvite(token);
  const issuerId = invite.data && invite.data.status !== "missing" ? invite.data.token.issuedById : null;
  const issuer = useQuery({
    queryKey: ["auth", "user", issuerId],
    queryFn: () => (issuerId ? getUserById(issuerId) : Promise.resolve(null)),
    enabled: !!issuerId,
  });

  if (invite.isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">초대 확인 중…</p>;
  }

  if (!invite.data || invite.data.status === "missing") {
    return <ErrorCard title="초대 링크를 찾을 수 없습니다" message="링크가 올바른지 확인해주세요." />;
  }

  if (invite.data.status === "expired") {
    return <ErrorCard title="만료된 초대 링크" message="초대를 보내신 분에게 새 링크를 요청해주세요." />;
  }

  if (invite.data.status === "used") {
    return <ErrorCard title="이미 사용된 초대 링크" message="동일한 토큰으로는 한 번만 가입할 수 있습니다." />;
  }

  if (!issuer.data) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">초대자 확인 중…</p>;
  }

  return (
    <SignupForm
      token={token}
      inviterId={issuer.data.id}
      inviterNickname={issuer.data.nickname}
    />
  );
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <Card title={title}>
      <p className="text-[14px] text-ink-muted">{message}</p>
      <div className="mt-4">
        <Link href="/">
          <Button variant="secondary">홈으로</Button>
        </Link>
      </div>
    </Card>
  );
}
