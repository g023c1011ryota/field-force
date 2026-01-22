import { NextRequest, NextResponse } from "next/server";

import { getAuthTokensFromCookies } from "@/lib/auth/cookies";
import { decodeJwtPayload } from "@/lib/auth/jwt";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const tokens = getAuthTokensFromCookies(request.cookies);
  const token = tokens.idToken ?? tokens.accessToken;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const profile = decodeJwtPayload(token) ?? {};

  return NextResponse.json(
    {
      user: {
        access_token: tokens.accessToken ?? "",
        id_token: tokens.idToken ?? undefined,
        refresh_token: tokens.refreshToken ?? undefined,
        token_type: "Bearer",
        profile,
      },
    },
    { status: 200 },
  );
}
