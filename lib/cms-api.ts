import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { CMS_COOKIE, isValidCmsToken } from "@/lib/cms-auth";
import { assertCmsMutationOrigin } from "@/lib/api/origin";
import { jsonUnauthorized } from "@/lib/api/response";

export async function requireCmsAuthResponse(): Promise<NextResponse | null> {
  const jar = await cookies();
  const token = jar.get(CMS_COOKIE)?.value;
  if (!isValidCmsToken(token)) {
    return jsonUnauthorized();
  }
  return null;
}

/**
 * Auth + same-origin check for cookie-authenticated mutating CMS routes.
 */
export async function requireCmsMutation(
  request: Request,
): Promise<NextResponse | null> {
  const denied = await requireCmsAuthResponse();
  if (denied) return denied;
  return assertCmsMutationOrigin(request);
}
