"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findUserByNickname } from "../services/users.service";
import { useSessionStore } from "../store/session.store";

export function useLogin() {
  const login = useSessionStore((s) => s.login);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nickname: string) => {
      const trimmed = nickname.trim();
      if (trimmed.length === 0) throw new Error("이름을 입력해주세요");
      const user = await findUserByNickname(trimmed);
      if (!user) {
        throw new Error(
          "일치하는 회원이 없습니다. 초대 링크가 필요합니다 — 가까운 회원에게 받아주세요.",
        );
      }
      return user;
    },
    onSuccess: (user) => {
      login(user.id);
      qc.invalidateQueries({ queryKey: ["auth"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useLogout() {
  const logout = useSessionStore((s) => s.logout);
  const qc = useQueryClient();
  return () => {
    logout();
    qc.invalidateQueries({ queryKey: ["auth"] });
    qc.invalidateQueries({ queryKey: ["jobs"] });
  };
}
