"use client";

import { create } from "zustand";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));
