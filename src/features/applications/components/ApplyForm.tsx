"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Button, Card, Input } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useJobQuery } from "@/features/jobs/hooks/useJobsQuery";
import { APPLY_LABELS } from "@/features/jobs/lib/labels";
import type { ApplyField } from "@/features/jobs/types";
import { useCreateApplication, useMyApplicationForJob } from "../hooks/useApplications";

type Props = { jobId: string };

export function ApplyForm({ jobId }: Props) {
  const router = useRouter();
  const { user, hydrated } = useCurrentUser();
  const job = useJobQuery(jobId);
  const myApp = useMyApplicationForJob(jobId, user?.id ?? null);
  const create = useCreateApplication();

  const [values, setValues] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    if (!user || !job.data) return;
    setValues((prev) => ({
      name: prev.name ?? user.nickname,
      age: prev.age ?? "",
      gender:
        prev.gender ??
        (user.gender === "male" ? "남자" : user.gender === "female" ? "여자" : ""),
      contact: prev.contact ?? (user.phone ?? ""),
      career: prev.career ?? "",
      address: prev.address ?? "",
      physical: prev.physical ?? "",
      license: prev.license ?? "",
      note: prev.note ?? "",
    }));
  }, [user, job.data]);

  if (!hydrated || job.isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }
  if (!user) return null;
  if (!job.data) {
    return (
      <Card title="공고를 찾을 수 없습니다">
        <p className="text-[14px] text-ink-muted">삭제되었거나 잘못된 링크입니다.</p>
      </Card>
    );
  }
  const j = job.data;

  if (j.authorName === user.nickname) {
    return (
      <Card title="본인 공고에는 신청할 수 없습니다">
        <Button variant="secondary" onClick={() => router.back()}>
          돌아가기
        </Button>
      </Card>
    );
  }
  if (j.status === "closed") {
    return (
      <Card title="마감된 공고입니다">
        <Button variant="secondary" onClick={() => router.back()}>
          돌아가기
        </Button>
      </Card>
    );
  }
  if (myApp.data) {
    return (
      <Card title="이미 신청을 제출했습니다">
        <p className="text-[14px] text-ink-muted">제출된 정보:</p>
        <dl className="mt-3 grid grid-cols-[80px_1fr] gap-y-1 text-[13.5px]">
          {Object.entries(myApp.data.data).map(([k, v]) => (
            <FragmentRow key={k} label={APPLY_LABELS[k as ApplyField] ?? k} value={v} />
          ))}
        </dl>
      </Card>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!user) return;
    const filtered: Record<string, string> = {};
    for (const f of j.applyFields) {
      const v = (values[f] ?? "").trim();
      if (v === "") {
        setSubmitError(`${APPLY_LABELS[f]}을(를) 입력해주세요`);
        return;
      }
      filtered[f] = v;
    }
    create.mutate(
      {
        jobId: j.id,
        applicantId: user.id,
        applicantNickname: user.nickname,
        data: filtered,
      },
      {
        onSuccess: () => router.push(`/jobs/${j.id}` as Route),
        onError: (e) => setSubmitError(e instanceof Error ? e.message : "오류가 발생했습니다"),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card title={`신청 — ${j.authorName} 님의 공고`}>
        <p className="text-[13px] text-ink-muted">
          작성자가 카톡 등으로 직접 연락드릴 수 있도록, 받기로 한 정보를 입력해주세요.
        </p>
      </Card>
      <div className="flex flex-col gap-3">
        {j.applyFields.map((f) => (
          <Input
            key={f}
            label={APPLY_LABELS[f]}
            value={values[f] ?? ""}
            onChange={(e) => setValues((p) => ({ ...p, [f]: e.target.value }))}
          />
        ))}
      </div>
      {submitError ? <p className="text-[14px] text-danger">{submitError}</p> : null}
      <Button type="submit" size="lg" isLoading={create.isPending}>
        신청 제출
      </Button>
    </form>
  );
}

function FragmentRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </>
  );
}
