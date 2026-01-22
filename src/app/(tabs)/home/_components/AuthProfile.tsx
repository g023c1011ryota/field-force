"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function AuthProfile() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    await auth.signOut();
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div>
      <pre>Hello: {String(auth.user.profile.email ?? "")}</pre>
      <pre>ID Token: {auth.user.id_token}</pre>
      <pre>Access Token: {auth.user.access_token}</pre>
      <pre>Refresh Token: {auth.user.refresh_token}</pre>

      <button type="button" onClick={signOutRedirect}>
        Sign out
      </button>
    </div>
  );
}
