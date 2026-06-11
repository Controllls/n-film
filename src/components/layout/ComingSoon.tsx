import Link from "next/link";
import { Button, Card } from "@/components/ui";

type Props = {
  title: string;
  phase: string;
  description: string;
};

export function ComingSoon({ title, phase, description }: Props) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-8 px-6 py-16">
      <Link href="/" className="text-[13px] text-ink-muted hover:text-ink">
        ← 엔필름
      </Link>
      <Card title={`${title} · ${phase}`}>
        <p className="text-[15px] leading-relaxed text-ink-muted">{description}</p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="secondary">홈으로</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
