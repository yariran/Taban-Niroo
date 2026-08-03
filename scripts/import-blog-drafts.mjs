#!/usr/bin/env node
/**
 * Import Markdown drafts into the blog CMS manifest (`data/blog.json`).
 *
 * Usage:
 *   node scripts/import-blog-drafts.mjs <dir>              # dry run
 *   node scripts/import-blog-drafts.mjs <dir> --write      # persist
 *   node scripts/import-blog-drafts.mjs <dir> --write --draft
 *
 * Each `NN-slug.md` file becomes one post:
 *   slug     ← filename with the ordering prefix and extension stripped
 *   title    ← the leading `# ` line
 *   body     ← everything after the title
 *   excerpt  ← first paragraph, trimmed to ~200 chars on a word boundary
 *
 * Posts are published newest-first in filename order, so `01-…` sits at
 * the top of the listing. Re-running is safe: a post whose slug already
 * exists is updated in place and keeps its original id and publishedAt,
 * so hand-edits made in the admin UI are not silently renumbered.
 *
 * Writes go through the same `.bak` + atomic-rename dance `lib/cms-store.ts`
 * uses locally. This script is local-disk only — when `BLOB_READ_WRITE_TOKEN`
 * is set the app reads from Vercel Blob instead, and importing there should
 * go through the admin UI.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const MANIFEST = path.resolve(process.cwd(), "data", "blog.json");
const EXCERPT_MAX = 200;
/** Days between consecutive posts when back-dating the publish schedule. */
const PUBLISH_STRIDE_DAYS = 4;

function slugFromFilename(filename) {
  return filename
    .replace(/\.md$/i, "")
    .replace(/^\d+[-_]/, "")
    .toLowerCase();
}

function makeExcerpt(body) {
  const firstPara = body
    .split(/\n\n+/)
    .map((b) => b.trim())
    .find((b) => b && !b.startsWith("#") && !/^[-*\d]/.test(b));
  if (!firstPara) return "";

  // Strip inline emphasis so the card copy reads as plain prose.
  const plain = firstPara.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
  if (plain.length <= EXCERPT_MAX) return plain;

  const cut = plain.slice(0, EXCERPT_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : EXCERPT_MAX).trimEnd()}…`;
}

function parseDraft(raw, filename) {
  const text = raw.replace(/\r\n/g, "\n").trim();
  const titleMatch = /^#\s+(.+)$/m.exec(text);
  if (!titleMatch) {
    throw new Error(`${filename}: no leading "# Title" line found`);
  }
  const title = titleMatch[1].trim();
  const body = text.slice(titleMatch.index + titleMatch[0].length).trim();
  if (!body) throw new Error(`${filename}: body is empty`);

  return {
    slug: slugFromFilename(filename),
    title,
    body,
    excerpt: makeExcerpt(body),
  };
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST, "utf8");
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    };
  } catch {
    return { version: 1, updatedAt: new Date().toISOString(), posts: [] };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  const write = args.includes("--write");
  const asDraft = args.includes("--draft");

  if (!dir) {
    console.error("Usage: node scripts/import-blog-drafts.mjs <dir> [--write] [--draft]");
    process.exit(1);
  }

  const absDir = path.resolve(process.cwd(), dir);
  const filenames = (await fs.readdir(absDir)).filter((f) => f.endsWith(".md")).sort();
  if (!filenames.length) {
    console.error(`No .md files in ${absDir}`);
    process.exit(1);
  }

  // Read and parse everything up front so a malformed draft aborts the
  // run before any post is touched.
  const drafts = [];
  for (const filename of filenames) {
    const raw = await fs.readFile(path.join(absDir, filename), "utf8");
    drafts.push(parseDraft(raw, filename));
  }

  const manifest = await readManifest();
  const bySlug = new Map(manifest.posts.map((p) => [p.slug, p]));
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  let created = 0;
  let updated = 0;

  drafts.forEach((parsed, index) => {
    const existing = bySlug.get(parsed.slug);

    // Newest first: index 0 keeps "now", each later file steps further back.
    const publishedAt = new Date(
      now - index * PUBLISH_STRIDE_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();

    if (existing) {
      updated += 1;
      bySlug.set(parsed.slug, {
        ...existing,
        title: parsed.title,
        excerpt: parsed.excerpt,
        body: parsed.body,
        status: asDraft ? "draft" : existing.status,
        updatedAt: nowIso,
      });
    } else {
      created += 1;
      bySlug.set(parsed.slug, {
        id: newId(),
        slug: parsed.slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        body: parsed.body,
        coverImage: null,
        status: asDraft ? "draft" : "published",
        publishedAt: asDraft ? null : publishedAt,
        updatedAt: nowIso,
      });
    }

    console.log(
      `${existing ? "update" : "create"}  ${parsed.slug}\n         ${parsed.title}`,
    );
  });

  const next = {
    version: 1,
    updatedAt: nowIso,
    posts: [...bySlug.values()],
  };

  console.log(
    `\n${created} created, ${updated} updated, ${next.posts.length} total.`,
  );

  if (!write) {
    console.log("Dry run — pass --write to persist to data/blog.json");
    return;
  }

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.copyFile(MANIFEST, `${MANIFEST}.bak`).catch(() => {});
  const tmp = `${MANIFEST}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, MANIFEST);
  console.log(`Wrote ${MANIFEST}`);
}

await main();
