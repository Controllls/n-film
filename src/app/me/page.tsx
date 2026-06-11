import { MobileShell } from "@/components/layout/MobileShell";
import { MyPage } from "@/features/auth/components/MyPage";

export default function MePage() {
  return (
    <MobileShell back={{ href: "/jobs", label: "공고" }} title="마이페이지">
      <MyPage />
    </MobileShell>
  );
}
