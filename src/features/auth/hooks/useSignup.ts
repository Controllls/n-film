"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consumeInvite } from "../services/invites.service";
import {
  createUser,
  findUserByNickname,
  isNicknameTaken,
} from "../services/users.service";
import { useSessionStore } from "../store/session.store";
import type { SignupInput } from "../types";

export function useSignup() {
  const login = useSessionStore((s) => s.login);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ input, token }: { input: SignupInput; token: string }) => {
      const user = await createUser(input);
      await consumeInvite(token, user.id);
      return user;
    },
    onSuccess: (user) => {
      login(user.id);
      qc.invalidateQueries({ queryKey: ["auth"] });
      qc.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}

export function useNicknameAvailability(nickname: string) {
  return useQuery({
    queryKey: ["auth", "nickname", nickname],
    queryFn: async () => {
      const taken = await isNicknameTaken(nickname);
      return { taken };
    },
    enabled: nickname.trim().length >= 2,
    staleTime: 3_000,
  });
}

export async function fetchUserByNicknameForPreview(
  nickname: string,
): Promise<{ exists: boolean }> {
  const u = await findUserByNickname(nickname);
  return { exists: u !== null };
}
