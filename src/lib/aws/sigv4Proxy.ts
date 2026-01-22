import { NextRequest, NextResponse } from "next/server";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Hash } from "@aws-sdk/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import type { SourceData } from "@smithy/types";

import { getAuthTokensFromCookies } from "@/lib/auth/cookies";
export type RouteContext = {
  params: {
    path?: string[];
  };
};

type AuthMode = "sigv4" | "jwt";

type SigV4ProxyOptions = {
  prefix?: string;
  authMode?: AuthMode;
};

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const OMITTED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "authorization",
  "x-amz-date",
  "x-amz-security-token",
  "x-amz-content-sha256",
]);

const resolveBaseUrl = () => {
  const baseUrl = process.env.AWS_SIGNED_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("AWS_SIGNED_API_BASE_URL is not set");
  }
  return baseUrl;
};

const resolveRegion = () => {
  const region = process.env.AWS_SIGV4_REGION ?? process.env.AWS_REGION;
  if (!region) {
    throw new Error("AWS_SIGV4_REGION or AWS_REGION is not set");
  }
  return region;
};

const resolveService = () => process.env.AWS_SIGV4_SERVICE ?? "execute-api";
const resolveAuthMode = (mode?: AuthMode): AuthMode => {
  const envMode = process.env.AWS_PROXY_AUTH_MODE;
  const value = mode ?? (envMode as AuthMode | undefined) ?? "jwt";
  return value === "sigv4" ? "sigv4" : "jwt";
};

class Sha256 extends Hash {
  constructor(secret?: SourceData) {
    super("sha256", secret);
  }
}

const signer = new SignatureV4({
  credentials: defaultProvider(),
  region: async () => resolveRegion(),
  service: resolveService(),
  sha256: Sha256,
});

const normalizePrefix = (prefix: string | undefined) => {
  if (!prefix) {
    return "";
  }
  const trimmed = prefix.trim().replace(/\/$/, "");
  if (!trimmed) {
    return "";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const buildTargetUrl = (
  prefix: string | undefined,
  pathSegments: string[] | undefined,
  requestUrl: URL,
) => {
  const base = new URL(resolveBaseUrl());
  const basePath = base.pathname.replace(/\/$/, "");
  const prefixPath = normalizePrefix(prefix);
  const extraPath = pathSegments?.length ? `/${pathSegments.join("/")}` : "";
  const pathname = `${basePath}${prefixPath}${extraPath}` || "/";

  const target = new URL(base.toString());
  target.pathname = pathname;
  target.search = requestUrl.search;
  return target;
};

const collectForwardHeaders = (
  request: NextRequest,
  includeAuthorization: boolean,
) => {
  const headers: Record<string, string> = {};
  const omitted = new Set(OMITTED_REQUEST_HEADERS);
  if (includeAuthorization) {
    omitted.delete("authorization");
  }
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (omitted.has(lowerKey)) {
      return;
    }
    headers[lowerKey] = value;
  });
  return headers;
};

const readBody = async (request: NextRequest) => {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return undefined;
  }
  const buffer = Buffer.from(await request.arrayBuffer());
  return buffer.length > 0 ? buffer : undefined;
};

const filterResponseHeaders = (headers: Headers) => {
  const filtered = new Headers();
  headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      return;
    }
    filtered.set(key, value);
  });
  return filtered;
};

const fetchSigned = async (
  method: string,
  targetUrl: URL,
  headers: Record<string, string>,
  body: Buffer | undefined,
) => {
  const httpRequest = new HttpRequest({
    protocol: targetUrl.protocol,
    hostname: targetUrl.hostname,
    port: targetUrl.port ? Number(targetUrl.port) : undefined,
    method,
    path: `${targetUrl.pathname}${targetUrl.search}`,
    headers,
    body,
  });

  const signedRequest = await signer.sign(httpRequest);
  const signedHeaders = new Headers(
    signedRequest.headers as Record<string, string>,
  );
  signedHeaders.delete("host");
  signedHeaders.delete("content-length");

  return fetch(targetUrl.toString(), {
    method,
    headers: signedHeaders,
    body: body ? Buffer.from(body) : undefined,
  });
};

export async function handleSigV4Proxy(
  request: NextRequest,
  context: RouteContext,
  options: SigV4ProxyOptions = {},
) {
  try {
    const authMode = resolveAuthMode(options.authMode);
    const targetUrl = buildTargetUrl(
      options.prefix,
      context.params.path,
      request.nextUrl,
    );
    const body = await readBody(request);
    const signRequest = authMode === "sigv4";
    const headers = collectForwardHeaders(request, !signRequest);
    if (!signRequest && !request.headers.get("authorization")) {
      const tokens = getAuthTokensFromCookies(request.cookies);
      const token = tokens.accessToken ?? tokens.idToken;
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }
    }

    const upstreamResponse = signRequest
      ? await fetchSigned(request.method, targetUrl, headers, body)
      : await fetch(targetUrl.toString(), {
        method: request.method,
        headers: new Headers(headers),
        body,
      });

    const responseBody = await upstreamResponse.arrayBuffer();
    const responseHeaders = filterResponseHeaders(upstreamResponse.headers);

    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
