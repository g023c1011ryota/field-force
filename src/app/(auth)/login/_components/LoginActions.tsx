"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildCognitoLogoutUrl } from "@/lib/auth/cognito";

export function LoginActions() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    await auth.removeUser();
    window.location.href = buildCognitoLogoutUrl();
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre>Hello: {auth.user?.profile.email}</pre>
        <pre>ID Token: {auth.user?.id_token}</pre>
        <pre>Access Token: {auth.user?.access_token}</pre>
        <pre>Refresh Token: {auth.user?.refresh_token}</pre>

        <button type="button" onClick={signOutRedirect}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => auth.signinRedirect()}>
        Sign in
      </button>
      <button type="button" onClick={signOutRedirect}>
        Sign out
      </button>
    </div>
  );
}
