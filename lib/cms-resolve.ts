import type { ContentBlock } from "@/lib/cms-content-types";

/** Use CMS field when non-empty; otherwise keep the hardcoded site default. */
export function cmsText(
  block: ContentBlock | undefined,
  key: keyof ContentBlock,
  fallback: string,
): string {
  if (!block) return fallback;
  const value = block[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

export function cmsImage(
  block: ContentBlock | undefined,
  fallback: string | null,
): string | null {
  if (block?.image != null && String(block.image).trim()) {
    return String(block.image).trim();
  }
  return fallback;
}
