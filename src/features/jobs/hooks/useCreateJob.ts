"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "../services/jobs.service";
import { jobKeys } from "./useJobsQuery";
import type { JobInput } from "../types";

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobInput) => createJob(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}
