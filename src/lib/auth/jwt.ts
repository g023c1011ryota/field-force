export type JwtPayload = Record<string, unknown>;

const decodeBase64Url = (input: string) => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
};

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};
