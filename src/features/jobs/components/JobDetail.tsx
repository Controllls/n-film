"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { JobCard } from "./JobCard";
import { useJobQuery } from "../hooks/useJobsQuery";
import { useToggleJobStatus } from "../hooks/useToggleJobStatus";

type Props = { id: string };

export function JobDetail({ id }: Props) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data: job, isLoading, isError } = useJobQuery(id);
  const toggleStatus = useToggleJobStatus();

  if (isLoading) {
    return <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>;
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-[14px] text-danger">공고를 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={() => router.push("/jobs")}>
          전체 공고로
        </Button>
      </div>
    );
  }

  function handleApply() {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/jobs/${id}/apply` as Parameters<typeof router.push>[0]);
  }

  function handleSeeApplicants() {
    router.push(`/jobs/${id}/applicants` as Parameters<typeof router.push>[0]);
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("공유 링크가 복사되었습니다.");
    } catch {
      window.prompt("아래 링크를 복사해주세요", url);
    }
  }

  const isMine = !!user && user.nickname === job.authorName;

  return (
    <JobCard
      job={job}
      isOwner={isMine}
      onApply={isMine ? undefined : handleApply}
      onShare={handleShare}
      onToggleStatus={isMine ? () => toggleStatus.mutate(job.id) : undefined}
      onSeeApplicants={isMine ? handleSeeApplicants : undefined}
    />
  );
}
