"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { JobCard } from "./JobCard";
import { FeedFilters } from "./FeedFilters";
import { filterJobs, useJobsQuery } from "../hooks/useJobsQuery";
import { useToggleJobStatus } from "../hooks/useToggleJobStatus";
import type { Role } from "../types";

export function JobsFeed() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data, isLoading, isError, error, refetch } = useJobsQuery();
  const toggleStatus = useToggleJobStatus();
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [showClosed, setShowClosed] = useState(false);

  const visible = useMemo(
    () => filterJobs(data ?? [], { roles: selectedRoles, showClosed }),
    [data, selectedRoles, showClosed],
  );

  function toggleRole(role: Role) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  function handleApply(jobId: string) {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push(`/jobs/${jobId}/apply` as Parameters<typeof router.push>[0]);
  }

  function handleSeeApplicants(jobId: string) {
    router.push(`/jobs/${jobId}/applicants` as Parameters<typeof router.push>[0]);
  }

  async function handleShare(id: string) {
    const url = `${window.location.origin}/jobs/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("공유 링크가 복사되었습니다.");
    } catch {
      window.prompt("아래 링크를 복사해주세요", url);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FeedFilters
        selectedRoles={selectedRoles}
        showClosed={showClosed}
        onToggleRole={toggleRole}
        onClearRoles={() => setSelectedRoles([])}
        onToggleShowClosed={() => setShowClosed((v) => !v)}
      />

      {isLoading ? (
        <p className="py-8 text-center text-[14px] text-ink-soft">불러오는 중…</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-[14px] text-danger">
            {error instanceof Error ? error.message : "공고를 불러오지 못했습니다"}
          </p>
          <Button variant="secondary" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-[14px] text-ink-soft">조건에 맞는 공고가 없습니다.</p>
          {selectedRoles.length > 0 || showClosed ? (
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedRoles([]);
                setShowClosed(false);
              }}
            >
              필터 초기화
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((job) => {
            const isMine = !!user && user.nickname === job.authorName;
            return (
              <li key={job.id}>
                <JobCard
                  job={job}
                  isOwner={isMine}
                  onApply={isMine ? undefined : () => handleApply(job.id)}
                  onShare={() => handleShare(job.id)}
                  onToggleStatus={
                    isMine ? () => toggleStatus.mutate(job.id) : undefined
                  }
                  onSeeApplicants={
                    isMine ? () => handleSeeApplicants(job.id) : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
