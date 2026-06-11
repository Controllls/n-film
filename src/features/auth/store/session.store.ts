"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SessionState = {
  currentUserId: string | null;
  hydrated: boolean;
  login: (userId: string) => void;
  logout: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentUserId: null,
      hydrated: false,
      login: (userId) => set({ currentUserId: userId }),
      logout: () => set({ currentUserId: null }),
    }),
    {
      name: "nfilm:session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentUserId: state.currentUserId }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
