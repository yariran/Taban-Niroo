import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  emptySiteContent,
  readSiteContent,
  writeSiteContent,
} from "@/lib/cms-content";
import { rateLimit } from "@/lib/rate-limit";
import { siteContentPutSchema } from "@/lib/schemas/cms";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, siteContentPutSchema);
  if (!parsed.ok) return parsed.response;

  const incoming = parsed.data;
  const base = emptySiteContent();
  const next = await writeSiteContent({
    ...base,
    ...incoming,
    home: { ...base.home, ...(incoming.home ?? {}) },
    about: { ...(incoming.about ?? {}) },
    projects: { ...(incoming.projects ?? {}) },
    contact: { ...(incoming.contact ?? {}) },
    products: { ...(incoming.products ?? {}) },
    blog: { ...(incoming.blog ?? {}) },
    legal: { ...(incoming.legal ?? {}) },
    footer: incoming.footer ?? base.footer,
    version: 1,
  });

  for (const path of [
    "/",
    "/about",
    "/projects",
    "/contact",
    "/products",
    "/blog",
    "/terms",
    "/privacy",
    "/imprint",
    "/admin/content",
  ]) {
    revalidatePath(path);
  }

  return jsonOk({ ok: true, ...next });
}
