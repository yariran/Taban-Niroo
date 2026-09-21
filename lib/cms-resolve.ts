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

/**
 * A split headline is ONE string that happens to be set on several lines,
 * so it resolves as one unit rather than as N independent `cmsText` calls.
 *
 * Per-key fallback is right for a body paragraph and wrong here. English
 * needs three lines for the products headline; Persian says the same thing
 * in two. With a fallback per line, the locale that stops at two inherits
 * the English third line and the page renders a half-translated lockup —
 * and because that orphan line is LTR inside an RTL heading, it re-wraps
 * into a different shape at every breakpoint: two stacked lines with the
 * full stop on the wrong side at 375px, word order reversed at 768px, and
 * overflowing its grid column at 1440px. One heading, three layouts, none
 * of them intended.
 *
 * So: once a block supplies its own `title`, the whole lockup comes from
 * that block. A line it does not define is a line that locale does not
 * want. Blocks with no `title` at all fall back wholesale, which is what
 * keeps an un-migrated locale showing English copy rather than nothing.
 */
export function cmsHeadlineLines(
  block: ContentBlock | undefined,
  fallbacks: readonly string[],
): string[] {
  const keys = ["title", "titleLine2", "titleLine3"] as const;
  const own = typeof block?.title === "string" && block.title.trim();

  if (!own) return fallbacks.filter((line) => line.trim());

  return keys
    .slice(0, Math.max(fallbacks.length, 1))
    .map((key) => {
      const value = block?.[key];
      return typeof value === "string" ? value.trim() : "";
    })
    .filter(Boolean);
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
