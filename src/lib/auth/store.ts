import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type AuthUser } from "@/lib/mock-api";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "error";
  error?: string;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: { name: string; email: string; password: string; institution?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",
      async login(email, password) {
        set({ status: "loading", error: undefined });
        try {
          const user = await authApi.login({ email, password });
          set({ user, status: "idle" });
          return user;
        } catch (e) {
          set({ status: "error", error: (e as Error).message });
          throw e;
        }
      },
      async signup(input) {
        set({ status: "loading", error: undefined });
        try {
          const user = await authApi.signup(input);
          set({ user, status: "idle" });
          return user;
        } catch (e) {
          set({ status: "error", error: (e as Error).message });
          throw e;
        }
      },
      async logout() {
        await authApi.logout();
        set({ user: null });
      },
    }),
    { name: "aether-auth" }
  )
);
