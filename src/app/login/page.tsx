import { MobileShell } from "@/components/layout/MobileShell";
import { LoginScreen } from "@/features/auth/components/LoginScreen";

export default function LoginPage() {
  return (
    <MobileShell back={{ href: "/", label: "홈" }} title="로그인">
      <LoginScreen />
    </MobileShell>
  );
}
