#!/usr/bin/env node
/**
 * Recompress large assets under public/images (and public/videos still
 * frames if any). Keeps filenames/extensions so SITE_IMAGES paths stay valid.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, renameSync, unlinkSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = join(process.cwd(), "public", "images");
const MIN_BYTES = 180 * 1024;
const MAX_EDGE = 2400;

function which(bin) {
  try {
    return execFileSync("which", [bin], { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

const magick = which("magick") || which("convert");
if (!magick) {
  console.error("ImageMagick (magick/convert) is required.");
  process.exit(1);
}

const files = readdirSync(ROOT).filter((name) => {
  const ext = extname(name).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
});

let saved = 0;
let touched = 0;

for (const name of files) {
  const src = join(ROOT, name);
  const before = statSync(src).size;
  if (before < MIN_BYTES) continue;

  const ext = extname(name).toLowerCase();
  const tmp = join(ROOT, `.opt-${name}`);

  try {
    if (ext === ".png") {
      // Photographic PNGs compress poorly; keep PNG but strip + resize + max zlib.
      execFileSync(
        magick,
        [
          src,
          "-strip",
          "-resize",
          `${MAX_EDGE}x${MAX_EDGE}>`,
          "-define",
          "png:compression-level=9",
          "-define",
          "png:compression-filter=5",
          tmp,
        ],
        { stdio: "pipe" },
      );
    } else if (ext === ".webp") {
      execFileSync(
        magick,
        [
          src,
          "-strip",
          "-resize",
          `${MAX_EDGE}x${MAX_EDGE}>`,
          "-quality",
          "82",
          tmp,
        ],
        { stdio: "pipe" },
      );
    } else {
      execFileSync(
        magick,
        [
          src,
          "-strip",
          "-resize",
          `${MAX_EDGE}x${MAX_EDGE}>`,
          "-sampling-factor",
          "4:2:0",
          "-quality",
          "82",
          tmp,
        ],
        { stdio: "pipe" },
      );
    }

    if (!existsSync(tmp)) continue;
    const after = statSync(tmp).size;
    if (after >= before * 0.98) {
      unlinkSync(tmp);
      continue;
    }

    renameSync(tmp, src);
    const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
    console.log(`  ${name}: ${kb(before)} → ${kb(after)}`);
    saved += before - after;
    touched += 1;
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.warn(`  skip ${name}:`, err.message?.split("\n")[0] ?? err);
  }
}

console.log(
  touched
    ? `\nOptimized ${touched} file(s), saved ${(saved / 1024 / 1024).toFixed(2)} MB.`
    : "\nNo images needed recompression.",
);
