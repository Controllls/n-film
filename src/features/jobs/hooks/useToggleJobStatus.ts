"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleJobStatus } from "../services/jobs.service";
import { jobKeys } from "./useJobsQuery";

export function useToggleJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleJobStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}
