"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  canRate,
  createRating,
  listRatingsFor,
  summaryFor,
  summaryForNickname,
} from "../services/ratings.service";
import type { RatingInput } from "../types";

export const ratingKeys = {
  all: ["ratings"] as const,
  summary: (id: string) => [...ratingKeys.all, "summary", id] as const,
  summaryByNick: (nick: string) => [...ratingKeys.all, "summaryByNick", nick] as const,
  list: (id: string) => [...ratingKeys.all, "list", id] as const,
  canRate: (raterId: string, rateeId: string, jobId: string) =>
    [...ratingKeys.all, "canRate", raterId, rateeId, jobId] as const,
};

export function useRatingSummary(userId: string | null) {
  return useQuery({
    queryKey: userId ? ratingKeys.summary(userId) : ["ratings", "summary", "none"],
    queryFn: () => (userId ? summaryFor(userId) : Promise.resolve({ average: 0, count: 0 })),
    enabled: !!userId,
  });
}

export function useRatingSummaryByNickname(nickname: string) {
  return useQuery({
    queryKey: ratingKeys.summaryByNick(nickname),
    queryFn: () => summaryForNickname(nickname),
    enabled: nickname.length > 0,
  });
}

export function useRatingsList(userId: string | null) {
  return useQuery({
    queryKey: userId ? ratingKeys.list(userId) : ["ratings", "list", "none"],
    queryFn: () => (userId ? listRatingsFor(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}

export function useCanRate(args: {
  raterId: string;
  raterNickname: string;
  rateeId: string;
  rateeNickname: string;
  jobId: string;
} | null) {
  return useQuery({
    queryKey: args
      ? ratingKeys.canRate(args.raterId, args.rateeId, args.jobId)
      : ["ratings", "canRate", "none"],
    queryFn: () =>
      args
        ? canRate(args)
        : Promise.resolve({ ok: false as const, reason: "" }),
    enabled: !!args,
  });
}

export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RatingInput) => createRating(input),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ratingKeys.summary(r.rateeId) });
      qc.invalidateQueries({ queryKey: ratingKeys.summaryByNick(r.rateeNickname) });
      qc.invalidateQueries({ queryKey: ratingKeys.list(r.rateeId) });
      qc.invalidateQueries({
        queryKey: ratingKeys.canRate(r.raterId, r.rateeId, r.jobId),
      });
    },
  });
}
