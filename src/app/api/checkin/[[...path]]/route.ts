import type { NextRequest } from "next/server";

import { handleSigV4Proxy, type RouteContext } from "@/lib/aws/sigv4Proxy";

export const runtime = "nodejs";

const handler = (request: NextRequest, context: RouteContext) =>
  handleSigV4Proxy(request, context, { prefix: "checkin" });

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
