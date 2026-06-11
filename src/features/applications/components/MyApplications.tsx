"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { findUserByNickname } from "@/features/auth/services/users.service";
import { computeDDay } from "@/features/jobs/lib/dday";
import { getJob } from "@/features/jobs/services/jobs.service";
import { ROLE_LABELS } from "@/features/jobs/lib/labels";
import { AuthorStars } from "@/features/ratings/components/AuthorStars";
import { RatingForm } from "@/features/ratings/components/RatingForm";
import { useCanRate } from "@/features/ratings/hooks/useRatings";
import { useMyApplications } from "../hooks/useApplications";
import type { Application } from "../types";

export function MyApplicationsList() {
  const router = useRouter();
  const { user, hydrated } = useCurrentUser();
  const apps = useMyApplications(user?.id ?? null);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || apps.isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }
  if (!user) return null;

  if ((apps.data ?? []).length === 0) {
    return (
      <Card title="아직 신청한 공고가 없습니다">
        <Link href="/jobs">
          <Button variant="secondary">공고 보러 가기</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {(apps.data ?? []).map((app) => (
        <MyApplicationRow
          key={app.id}
          app={app}
          applicantId={user.id}
          applicantNickname={user.nickname}
        />
      ))}
    </div>
  );
}

function MyApplicationRow({
  app,
  applicantId,
  applicantNickname,
}: {
  app: Application;
  applicantId: string;
  applicantNickname: string;
}) {
  const [rateOpen, setRateOpen] = useState(false);
  const jobQ = useQuery({
    queryKey: ["jobs", "detail", app.jobId],
    queryFn: () => getJob(app.jobId),
  });
  const authorQ = useQuery({
    queryKey: ["auth", "userByNickname", jobQ.data?.authorName ?? ""],
    queryFn: () =>
      jobQ.data ? findUserByNickname(jobQ.data.authorName) : Promise.resolve(null),
    enabled: !!jobQ.data,
  });
  const job = jobQ.data;
  const author = authorQ.data;
  const ratable = job ? computeDDay(job.shootDate) <= 0 : false;

  const can = useCanRate(
    ratable && job && author
      ? {
          raterId: applicantId,
          raterNickname: applicantNickname,
          rateeId: author.id,
          rateeNickname: author.nickname,
          jobId: job.id,
        }
      : null,
  );

  if (!job) {
    return (
      <Card title="공고가 사라졌습니다">
        <p className="text-[13px] text-ink-soft">
          새로고침으로 인메모리 데이터가 초기화되었을 수 있습니다.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Link href={`/jobs/${job.id}`} className="block">
        <p className="text-[13px] text-ink-soft">{ROLE_LABELS[job.role]} · {job.shootDate}</p>
        <p className="mt-1 text-[14.5px] font-semibold text-ink">{job.authorName} 님의 공고</p>
      </Link>
      <div className="mt-1 flex items-center gap-2">
        <AuthorStars nickname={job.authorName} />
      </div>

      {ratable ? (
        <div className="mt-3">
          {can.data?.ok ? (
            rateOpen ? (
              author ? (
                <RatingForm
                  base={{
                    raterId: applicantId,
                    raterNickname: applicantNickname,
                    rateeId: author.id,
                    rateeNickname: author.nickname,
                    jobId: job.id,
                  }}
                  onDone={() => setRateOpen(false)}
                />
              ) : null
            ) : (
              <Button variant="secondary" size="md" onClick={() => setRateOpen(true)}>
                작성자에게 평점 남기기
              </Button>
            )
          ) : (
            <p className="text-[12.5px] text-ink-soft">
              {can.data && !can.data.ok ? can.data.reason : "확인 중…"}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-[12.5px] text-ink-soft">
          평점은 촬영일(D-{computeDDay(job.shootDate)}) 이후에 가능합니다.
        </p>
      )}
    </Card>
  );
}
