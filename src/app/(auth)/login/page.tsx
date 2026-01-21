"use client";

import { useState } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { AuthLoadingCard } from "@/features/auth/AuthLoadingCard";

export default function LoginPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
      {!isAuthenticating ? (
        <LoginForm onLoginClick={() => setIsAuthenticating(true)} />
      ) : (
        <AuthLoadingCard />
      )}
    </div>
  );
}
