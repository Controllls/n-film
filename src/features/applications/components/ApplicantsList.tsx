"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { findUserByNickname } from "@/features/auth/services/users.service";
import { useJobQuery } from "@/features/jobs/hooks/useJobsQuery";
import { APPLY_LABELS } from "@/features/jobs/lib/labels";
import type { ApplyField } from "@/features/jobs/types";
import { computeDDay } from "@/features/jobs/lib/dday";
import { AuthorStars } from "@/features/ratings/components/AuthorStars";
import { RatingForm } from "@/features/ratings/components/RatingForm";
import { useCanRate } from "@/features/ratings/hooks/useRatings";
import { useQuery } from "@tanstack/react-query";
import { useJobApplications } from "../hooks/useApplications";
import type { Application } from "../types";

type Props = { jobId: string };

export function ApplicantsList({ jobId }: Props) {
  const router = useRouter();
  const { user, hydrated } = useCurrentUser();
  const job = useJobQuery(jobId);
  const apps = useJobApplications(jobId);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (job.data && job.data.authorName !== user.nickname) {
      router.replace(`/jobs/${jobId}`);
    }
  }, [hydrated, user, job.data, router, jobId]);

  if (!hydrated || job.isLoading || apps.isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }
  if (!user || !job.data) return null;
  const j = job.data;
  if (j.authorName !== user.nickname) return null;

  const dDay = computeDDay(j.shootDate);
  const ratable = dDay <= 0;

  return (
    <div className="flex flex-col gap-3">
      <Card title={`신청자 ${apps.data?.length ?? 0}명`}>
        <p className="text-[13px] text-ink-muted">
          작성자만 볼 수 있는 명단입니다. 카톡으로 직접 연락해주세요.
        </p>
        {ratable ? (
          <p className="mt-1 text-[13px] text-ok">촬영이 끝났습니다. 평점을 남길 수 있습니다.</p>
        ) : (
          <p className="mt-1 text-[13px] text-ink-soft">
            평점은 촬영일 이후(D-{dDay} → 오늘)에 남길 수 있습니다.
          </p>
        )}
      </Card>

      {(apps.data ?? []).length === 0 ? (
        <Card title="아직 신청자가 없습니다">
          <p className="text-[14px] text-ink-soft">공고를 공유해 더 많은 사람이 보도록 해보세요.</p>
        </Card>
      ) : (
        (apps.data ?? []).map((app) => (
          <ApplicantCard
            key={app.id}
            app={app}
            jobId={jobId}
            rateMode={ratable}
            ownerId={user.id}
            ownerNickname={user.nickname}
          />
        ))
      )}
    </div>
  );
}

function ApplicantCard({
  app,
  jobId,
  rateMode,
  ownerId,
  ownerNickname,
}: {
  app: Application;
  jobId: string;
  rateMode: boolean;
  ownerId: string;
  ownerNickname: string;
}) {
  const [rateOpen, setRateOpen] = useState(false);
  const userQ = useQuery({
    queryKey: ["auth", "userByNickname", app.applicantNickname],
    queryFn: () => findUserByNickname(app.applicantNickname),
  });
  const rateeId = userQ.data?.id ?? null;

  const can = useCanRate(
    rateMode && rateeId
      ? {
          raterId: ownerId,
          raterNickname: ownerNickname,
          rateeId,
          rateeNickname: app.applicantNickname,
          jobId,
        }
      : null,
  );

  const targetLoginId = userQ.data?.loginId ?? "";

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={targetLoginId ? `/u/${targetLoginId}` : "#"}
          className="flex items-center gap-2"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent-strong">
            {app.applicantNickname.slice(0, 1)}
          </span>
          <span className="text-[14.5px] font-semibold text-ink">{app.applicantNickname}</span>
          <AuthorStars nickname={app.applicantNickname} />
        </Link>
      </div>
      <dl className="mt-3 grid grid-cols-[80px_1fr] gap-y-1 text-[13px]">
        {Object.entries(app.data).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-soft">{APPLY_LABELS[k as ApplyField] ?? k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {rateMode ? (
        <div className="mt-3">
          {can.data?.ok ? (
            rateOpen ? (
              <RatingForm
                base={{
                  raterId: ownerId,
                  raterNickname: ownerNickname,
                  rateeId: rateeId ?? "",
                  rateeNickname: app.applicantNickname,
                  jobId,
                }}
                onDone={() => setRateOpen(false)}
              />
            ) : (
              <Button variant="secondary" size="md" onClick={() => setRateOpen(true)}>
                평점 남기기
              </Button>
            )
          ) : (
            <p className="text-[12.5px] text-ink-soft">
              {can.data && !can.data.ok ? can.data.reason : "확인 중…"}
            </p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
