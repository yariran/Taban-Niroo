import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import {
  emptySiteContent,
  type SiteContent,
} from "@/lib/cms-content-types";

export type {
  ContentBlock,
  ContentItem,
  SiteContent,
} from "@/lib/cms-content-types";
export { emptySiteContent, blockHasContent } from "@/lib/cms-content-types";

const PATHNAME = "cms/site-content.json";

export async function readSiteContent(): Promise<SiteContent> {
  return readCmsJson(PATHNAME, emptySiteContent());
}

export async function writeSiteContent(
  content: SiteContent,
): Promise<SiteContent> {
  const next: SiteContent = {
    ...content,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(PATHNAME, next);
  return next;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    return await readSiteContent();
  } catch (err) {
    console.error("[cms-content] getSiteContent", err);
    return emptySiteContent();
  }
}
