import { cookies } from "next/headers";
import { CMS_COOKIE, isValidCmsToken } from "@/lib/cms-auth";

export async function isCmsAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return isValidCmsToken(jar.get(CMS_COOKIE)?.value);
}
