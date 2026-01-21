import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  statusMessage: string;
};

export const useAuthStore = create<AuthState>(() => ({
  isAuthenticated: false,
  statusMessage: "",
}));
