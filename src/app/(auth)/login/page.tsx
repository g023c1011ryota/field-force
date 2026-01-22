"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/features/auth/loginform";
import { AuthLoadingCard } from "@/features/auth/AuthLoadingCard";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.error) {
      setErrorMessage(auth.error.message);
      setIsAuthenticating(false);
    }
  }, [auth.error]);

  const handleLogin = async (payload: {
    identifier: string;
    password: string;
  }) => {
    setErrorMessage(null);
    setIsAuthenticating(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await Promise.all([auth.signIn(payload), delay]);
      router.replace("/pet");
    } catch (error) {
      await delay;
      const message =
        error instanceof Error ? error.message : "ログインに失敗しました";
      setErrorMessage(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isBusy = isAuthenticating || auth.isLoading;

  const displayErrorMessage = errorMessage ?? auth.error?.message ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/images/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* 中央カード */}
      {!isBusy ? (
        <LoginForm
          onLoginClick={handleLogin}
          isSubmitting={isBusy}
          errorMessage={displayErrorMessage}
        />
      ) : (
        <AuthLoadingCard />
      )}
    </div>
  );
}
