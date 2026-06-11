import { MobileShell } from "@/components/layout/MobileShell";
import { ProfileView } from "@/features/ratings/components/ProfileView";

type Props = { params: Promise<{ loginId: string }> };

export default async function UserProfilePage({ params }: Props) {
  const { loginId } = await params;
  return (
    <MobileShell back={{ href: "/jobs", label: "공고" }} title="프로필">
      <ProfileView loginId={loginId} />
    </MobileShell>
  );
}
