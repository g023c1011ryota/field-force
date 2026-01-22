import { NextRequest, NextResponse } from "next/server";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

import { AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";
import { decodeJwtPayload } from "@/lib/auth/jwt";

export const runtime = "nodejs";

type LoginPayload = {
  identifier?: string;
  password?: string;
};

const resolveRegion = () => {
  const region = process.env.AWS_COGNITO_REGION ?? process.env.AWS_REGION;
  if (!region) {
    throw new Error("AWS_COGNITO_REGION or AWS_REGION is not set");
  }
  return region;
};

const resolveClientId = () => {
  const clientId =
    process.env.AWS_COGNITO_CLIENT_ID ??
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  if (!clientId) {
    throw new Error("AWS_COGNITO_CLIENT_ID is not set");
  }
  return clientId;
};

const resolveClientSecret = () => process.env.AWS_COGNITO_CLIENT_SECRET;

const buildSecretHash = (username: string, clientId: string, secret: string) =>
  crypto
    .createHmac("sha256", secret)
    .update(`${username}${clientId}`)
    .digest("base64");

const buildCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  ...(typeof maxAge === "number" ? { maxAge } : {}),
});

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as LoginPayload;
    const identifier = payload.identifier?.trim();
    const password = payload.password ?? "";

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "IDとパスワードを入力してください" },
        { status: 400 },
      );
    }

    const clientId = resolveClientId();
    const clientSecret = resolveClientSecret();
    const region = resolveRegion();

    const authParams: Record<string, string> = {
      USERNAME: identifier,
      PASSWORD: password,
    };
    if (clientSecret) {
      authParams.SECRET_HASH = buildSecretHash(
        identifier,
        clientId,
        clientSecret,
      );
    }

    const client = new CognitoIdentityProviderClient({ region });
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: authParams,
    });
    const response = await client.send(command);

    if (response.ChallengeName) {
      return NextResponse.json(
        { message: "追加の認証が必要です", challenge: response.ChallengeName },
        { status: 409 },
      );
    }

    const result = response.AuthenticationResult;
    if (!result?.AccessToken) {
      return NextResponse.json(
        { message: "認証に失敗しました" },
        { status: 401 },
      );
    }

    const res = NextResponse.json(
      {
        user: {
          access_token: result.AccessToken,
          id_token: result.IdToken,
          refresh_token: result.RefreshToken,
          token_type: result.TokenType ?? "Bearer",
          profile: decodeJwtPayload(result.IdToken ?? result.AccessToken) ?? {},
        },
      },
      { status: 200 },
    );

    res.cookies.set(
      AUTH_COOKIE_NAMES.accessToken,
      result.AccessToken,
      buildCookieOptions(result.ExpiresIn),
    );

    if (result.IdToken) {
      res.cookies.set(
        AUTH_COOKIE_NAMES.idToken,
        result.IdToken,
        buildCookieOptions(result.ExpiresIn),
      );
    }

    if (result.RefreshToken) {
      res.cookies.set(
        AUTH_COOKIE_NAMES.refreshToken,
        result.RefreshToken,
        buildCookieOptions(60 * 60 * 24 * 30),
      );
    }

    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ログインに失敗しました";
    return NextResponse.json({ message }, { status: 500 });
  }
}
