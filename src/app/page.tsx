import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { MobileShell } from "@/components/layout/MobileShell";

export default function LandingPage() {
  return (
    <MobileShell>
      <section className="flex flex-col gap-5 py-4">
        <h1 className="text-[24px] font-semibold leading-tight tracking-tight text-ink">
          촬영 현장 인력,
          <br />
          신뢰로 빠르게 모이다.
        </h1>
        <p className="text-[14px] leading-relaxed text-ink-muted">
          감독은 필요할 때마다 공고를 올려 사람을 구하고, 일이 필요한 사람은 공고에
          신청합니다. 가입은 지인 추천(초대 링크)으로만 가능합니다.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/jobs">
            <Button size="lg" className="w-full">
              공고 보기
            </Button>
          </Link>
          <Link href="/jobs/new">
            <Button size="lg" variant="secondary" className="w-full">
              공고 올리기
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Card title="F-01 공고 올리기">
          역할·날짜·인원·페이 등을 입력하면 카톡 양식 그대로 피드에 게시됩니다.
        </Card>
        <Card title="F-02 카카오 로그인">
          카카오톡 한 번으로 로그인. (현재는 스텁 모드)
        </Card>
        <Card title="F-03 추천 가입">
          기존 회원이 발급한 초대 링크로만 가입할 수 있어 신뢰를 유지합니다.
        </Card>
      </section>

      <footer className="mt-auto border-t border-line pt-4 text-[12px] text-ink-soft">
        © 2026 엔필름 · Phase 1 (F-01)
      </footer>
    </MobileShell>
  );
}
