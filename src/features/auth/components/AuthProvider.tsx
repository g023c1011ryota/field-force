"use client";

import type { ReactNode } from "react";
import { AuthProvider as OidcAuthProvider } from "react-oidc-context";

import { cognitoAuthConfig } from "@/lib/auth/cognito";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  return <OidcAuthProvider {...cognitoAuthConfig}>{children}</OidcAuthProvider>;
}
