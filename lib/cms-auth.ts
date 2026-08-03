import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const CMS_COOKIE = "tn_cms_auth";
export const CMS_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 days

/** Default username when CMS_ADMIN_USERNAME is unset. */
const DEFAULT_USERNAME = "admin";

export function cmsPasswordConfigured(): boolean {
  return Boolean(process.env.CMS_ADMIN_PASSWORD?.trim());
}

export function cmsCredentialsConfigured(): boolean {
  return cmsPasswordConfigured();
}

export function cmsAdminUsername(): string {
  return process.env.CMS_ADMIN_USERNAME?.trim() || DEFAULT_USERNAME;
}

function sessionVersion(): string {
  return process.env.CMS_SESSION_VERSION?.trim() || "1";
}

/**
 * Signing key for CMS cookies. Prefer CMS_SESSION_SECRET; otherwise derive
 * from the admin password so password rotation invalidates sessions.
 */
function sessionSecret(): string | null {
  const explicit = process.env.CMS_SESSION_SECRET?.trim();
  if (explicit && explicit.length >= 16) return explicit;
  const password = process.env.CMS_ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return createHash("sha256")
    .update(`taban-cms-session-secret:v1:${password}`)
    .digest("hex");
}

type SessionPayload = {
  u: string;
  iat: number;
  exp: number;
  v: string;
  jti: string;
};

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function safeEqualString(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Create a signed, expiring session cookie value (not a password hash).
 * Format: v1.<base64url(json)>.<hmac>
 */
export function createCmsSession(): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  const now = Date.now();
  const payload: SessionPayload = {
    u: cmsAdminUsername(),
    iat: now,
    exp: now + CMS_SESSION_MAX_AGE_SEC * 1000,
    v: sessionVersion(),
    jti: randomBytes(16).toString("hex"),
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const sig = signBody(body, secret);
  return `v1.${body}.${sig}`;
}

/** @deprecated Use createCmsSession — kept for call-site clarity during migration. */
export function cmsAuthToken(): string | null {
  return createCmsSession();
}

export function isValidCmsToken(token: string | undefined | null): boolean {
  if (!token || !token.startsWith("v1.")) return false;
  const secret = sessionSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const body = parts[1]!;
  const sig = parts[2]!;
  const expected = signBody(body, secret);
  if (!safeEqualString(sig, expected)) return false;

  try {
    const json = Buffer.from(body, "base64url").toString("utf8");
    const payload = JSON.parse(json) as SessionPayload;
    if (typeof payload.u !== "string" || typeof payload.exp !== "number") {
      return false;
    }
    if (payload.exp < Date.now()) return false;
    if (payload.v !== sessionVersion()) return false;
    if (!safeEqualString(payload.u, cmsAdminUsername())) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyCmsPassword(password: string): boolean {
  const expected = process.env.CMS_ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return safeEqualString(password, expected);
}

export function verifyCmsCredentials(
  username: string,
  password: string,
): boolean {
  if (!cmsPasswordConfigured()) return false;
  const userOk = safeEqualString(username.trim(), cmsAdminUsername());
  const passOk = verifyCmsPassword(password);
  return userOk && passOk;
}

export function cmsSessionCookieOptions(maxAge = CMS_SESSION_MAX_AGE_SEC) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
