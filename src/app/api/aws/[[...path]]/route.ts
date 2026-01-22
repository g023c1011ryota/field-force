import { handleSigV4Proxy } from "@/lib/aws/sigv4Proxy";

export const runtime = "nodejs";

const handler = handleSigV4Proxy;

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
export const HEAD = handler;
