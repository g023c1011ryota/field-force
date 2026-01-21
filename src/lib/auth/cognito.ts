import type { UserManagerSettings } from "oidc-client-ts";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const authority =
  process.env.NEXT_PUBLIC_COGNITO_AUTHORITY ??
  "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_vrA9TylSt";

const clientId =
  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "8fdbgo54645igdmsqk5aumbrr";

const cognitoDomain =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN ??
  "https://ap-northeast-1vra9tylst.auth.ap-northeast-1.amazoncognito.com";

const redirectUri = `${appUrl}/login`;
const logoutUri = `${appUrl}/login`;

export const cognitoAuthConfig: UserManagerSettings = {
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "email openid phone",
};

export const cognitoLogoutConfig = {
  clientId,
  cognitoDomain,
  logoutUri,
};

export const buildCognitoLogoutUrl = () =>
  `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
