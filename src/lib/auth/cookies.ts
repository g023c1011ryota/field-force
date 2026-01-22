type CookieGetter = {
  get: (name: string) => { value: string } | undefined;
};

export const AUTH_COOKIE_NAMES = {
  accessToken: "ff_access_token",
  idToken: "ff_id_token",
  refreshToken: "ff_refresh_token",
} as const;

export type AuthTokens = {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
};

export const getAuthTokensFromCookies = (cookies: CookieGetter): AuthTokens => {
  const accessToken = cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? null;
  const idToken = cookies.get(AUTH_COOKIE_NAMES.idToken)?.value ?? null;
  const refreshToken =
    cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? null;

  return { accessToken, idToken, refreshToken };
};
