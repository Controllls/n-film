import { MobileShell } from "@/components/layout/MobileShell";
import { InviteGate } from "@/features/auth/components/InviteGate";

type Props = { params: Promise<{ token: string }> };

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  return (
    <MobileShell back={{ href: "/", label: "홈" }} title="초대 가입">
      <InviteGate token={token} />
    </MobileShell>
  );
}
