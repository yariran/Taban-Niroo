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
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { rateLimit } from "@/lib/rate-limit";
import { siteContentPutSchema } from "@/lib/schemas/cms";

function localeFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const raw = url.searchParams.get("locale")?.trim() ?? DEFAULT_LOCALE;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

function revalidateContentSurfaces() {
  for (const lang of LOCALES) {
    for (const path of [
      `/${lang}`,
      `/${lang}/about`,
      `/${lang}/projects`,
      `/${lang}/contact`,
      `/${lang}/products`,
      `/${lang}/blog`,
      `/${lang}/terms`,
      `/${lang}/privacy`,
      `/${lang}/imprint`,
    ]) {
      revalidatePath(path);
    }
  }
  revalidatePath("/admin/content");
}

export async function GET(request: Request) {
  const locale = localeFromRequest(request);
  const content = await readSiteContent(locale);
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

  const locale = localeFromRequest(request);
  const parsed = await parseJsonBody(request, siteContentPutSchema);
  if (!parsed.ok) return parsed.response;

  const incoming = parsed.data;
  const base = emptySiteContent();
  const next = await writeSiteContent(
    {
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
    },
    locale,
  );

  revalidateContentSurfaces();

  return jsonOk({ ok: true, locale, ...next });
}
