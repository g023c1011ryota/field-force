"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthUser = {
  id_token?: string;
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  profile: Record<string, unknown>;
};

const AUTH_BYPASS_ENABLED = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";
const AUTH_BYPASS_USER: AuthUser = {
  access_token: "dev-access-token",
  token_type: "Bearer",
  profile: {
    email: "dev@example.com",
    sub: "dev-user",
  },
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  signIn: (payload: { identifier: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (AUTH_BYPASS_ENABLED) {
      setUser(AUTH_BYPASS_USER);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = (await response.json()) as { user?: AuthUser | null };
      setUser(data.user ?? null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err : new Error("認証に失敗しました"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async (payload: { identifier: string; password: string }) => {
      setIsLoading(true);
      setError(null);
      if (AUTH_BYPASS_ENABLED) {
        setUser(AUTH_BYPASS_USER);
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(data.message ?? "ログインに失敗しました");
        }
        await refreshSession();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("ログインに失敗しました"));
        setIsLoading(false);
        throw err;
      }
    },
    [refreshSession],
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (AUTH_BYPASS_ENABLED) {
      setUser(AUTH_BYPASS_USER);
      setIsLoading(false);
      return;
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("ログアウトに失敗しました"));
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user?.access_token),
      error,
      signIn,
      signOut,
      refreshSession,
    }),
    [user, isLoading, error, signIn, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
