import { CMS_COOKIE, cmsSessionCookieOptions } from "@/lib/cms-auth";
import { jsonOk } from "@/lib/api/response";

export async function POST() {
  const res = jsonOk({ ok: true });
  res.cookies.set(CMS_COOKIE, "", {
    ...cmsSessionCookieOptions(0),
    maxAge: 0,
  });
  return res;
}
