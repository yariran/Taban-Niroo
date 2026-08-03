import {
  CMS_COOKIE,
  cmsCredentialsConfigured,
  createCmsSession,
  cmsSessionCookieOptions,
  verifyCmsCredentials,
} from "@/lib/cms-auth";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas/cms";

export async function POST(request: Request) {
  const limited = await rateLimit(request, "cms-login");
  if (!limited.ok) {
    return jsonTooMany(
      "Too many attempts. Try again later.",
      limited.retryAfterSec,
    );
  }

  if (!cmsCredentialsConfigured()) {
    return jsonError(
      503,
      "CMS credentials are not configured. Set CMS_ADMIN_PASSWORD on the server.",
      { code: "cms_not_configured" },
    );
  }

  const parsed = await parseJsonBody(request, loginSchema);
  if (!parsed.ok) return parsed.response;

  const { username, password } = parsed.data;
  if (!verifyCmsCredentials(username, password)) {
    return jsonError(401, "Invalid credentials.", { code: "invalid_credentials" });
  }

  const token = createCmsSession();
  if (!token) {
    return jsonError(503, "Auth unavailable.", { code: "auth_unavailable" });
  }

  const res = jsonOk({ ok: true });
  res.cookies.set(CMS_COOKIE, token, cmsSessionCookieOptions());
  return res;
}
