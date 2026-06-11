"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  getApplicationOf,
  listApplicationsByApplicant,
  listApplicationsByJob,
} from "../services/applications.service";
import type { ApplicationInput } from "../types";

export const appKeys = {
  all: ["applications"] as const,
  byJob: (jobId: string) => [...appKeys.all, "byJob", jobId] as const,
  byApplicant: (id: string) => [...appKeys.all, "byApplicant", id] as const,
  mine: (jobId: string, applicantId: string) =>
    [...appKeys.all, "mine", jobId, applicantId] as const,
};

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: appKeys.byJob(jobId),
    queryFn: () => listApplicationsByJob(jobId),
    enabled: jobId.length > 0,
  });
}

export function useMyApplications(applicantId: string | null) {
  return useQuery({
    queryKey: applicantId ? appKeys.byApplicant(applicantId) : ["applications", "none"],
    queryFn: () =>
      applicantId ? listApplicationsByApplicant(applicantId) : Promise.resolve([]),
    enabled: !!applicantId,
  });
}

export function useMyApplicationForJob(jobId: string, applicantId: string | null) {
  return useQuery({
    queryKey:
      applicantId && jobId
        ? appKeys.mine(jobId, applicantId)
        : ["applications", "none"],
    queryFn: () =>
      applicantId ? getApplicationOf(jobId, applicantId) : Promise.resolve(null),
    enabled: !!applicantId && jobId.length > 0,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ApplicationInput) => createApplication(input),
    onSuccess: (app) => {
      qc.invalidateQueries({ queryKey: appKeys.byJob(app.jobId) });
      qc.invalidateQueries({ queryKey: appKeys.byApplicant(app.applicantId) });
      qc.invalidateQueries({ queryKey: appKeys.mine(app.jobId, app.applicantId) });
    },
  });
}
