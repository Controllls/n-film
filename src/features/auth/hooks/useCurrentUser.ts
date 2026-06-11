"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserById } from "../services/users.service";
import { useSessionStore } from "../store/session.store";

export function useHydrated(): boolean {
  const hydrated = useSessionStore((s) => s.hydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && hydrated;
}

export function useCurrentUser() {
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const hydrated = useHydrated();
  const query = useQuery({
    queryKey: ["auth", "currentUser", currentUserId],
    queryFn: () => (currentUserId ? getUserById(currentUserId) : Promise.resolve(null)),
    enabled: hydrated && !!currentUserId,
  });
  return {
    user: query.data ?? null,
    hydrated,
    isLoading: hydrated && !!currentUserId && query.isLoading,
  };
}
