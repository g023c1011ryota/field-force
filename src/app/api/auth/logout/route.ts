import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";

export const runtime = "nodejs";

const expireOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });

  res.cookies.set(AUTH_COOKIE_NAMES.accessToken, "", expireOptions);
  res.cookies.set(AUTH_COOKIE_NAMES.idToken, "", expireOptions);
  res.cookies.set(AUTH_COOKIE_NAMES.refreshToken, "", expireOptions);

  return res;
}
