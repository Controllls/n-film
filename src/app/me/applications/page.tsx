import { MobileShell } from "@/components/layout/MobileShell";
import { MyApplicationsList } from "@/features/applications/components/MyApplications";

export default function MyApplicationsPage() {
  return (
    <MobileShell back={{ href: "/me", label: "마이" }} title="내 신청 내역">
      <MyApplicationsList />
    </MobileShell>
  );
}
