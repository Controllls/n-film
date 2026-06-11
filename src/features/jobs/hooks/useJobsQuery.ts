"use client";

import { useQuery } from "@tanstack/react-query";
import { getJob, listJobs } from "../services/jobs.service";
import type { Job, Role } from "../types";

export const jobKeys = {
  all: ["jobs"] as const,
  list: () => [...jobKeys.all, "list"] as const,
  detail: (id: string) => [...jobKeys.all, "detail", id] as const,
};

export function useJobsQuery() {
  return useQuery({
    queryKey: jobKeys.list(),
    queryFn: listJobs,
    staleTime: 5_000,
  });
}

export function useJobQuery(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => getJob(id),
    enabled: id.length > 0,
  });
}

export type JobsFilter = {
  roles: Role[];
  showClosed: boolean;
};

export function filterJobs(jobs: Job[], filter: JobsFilter): Job[] {
  return jobs.filter((j) => {
    if (!filter.showClosed && j.status === "closed") return false;
    if (filter.roles.length > 0 && !filter.roles.includes(j.role)) return false;
    return true;
  });
}
