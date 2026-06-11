"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvite,
  issueInvite,
  listInvitesByIssuer,
} from "../services/invites.service";

export const inviteKeys = {
  all: ["invites"] as const,
  byIssuer: (id: string) => [...inviteKeys.all, "byIssuer", id] as const,
  byToken: (token: string) => [...inviteKeys.all, "byToken", token] as const,
};

export function useMyInvites(issuerId: string | null) {
  return useQuery({
    queryKey: issuerId ? inviteKeys.byIssuer(issuerId) : ["invites", "none"],
    queryFn: () => (issuerId ? listInvitesByIssuer(issuerId) : Promise.resolve([])),
    enabled: !!issuerId,
  });
}

export function useInvite(token: string) {
  return useQuery({
    queryKey: inviteKeys.byToken(token),
    queryFn: () => getInvite(token),
    enabled: token.length > 0,
  });
}

export function useIssueInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (issuerId: string) => issueInvite(issuerId),
    onSuccess: (_token, issuerId) => {
      qc.invalidateQueries({ queryKey: inviteKeys.byIssuer(issuerId) });
    },
  });
}
