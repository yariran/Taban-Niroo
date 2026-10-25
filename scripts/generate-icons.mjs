#!/usr/bin/env node
/**
 * Rasterise the brand mark in assets-raw/brand-mark.svg into every favicon
 * size the site serves, plus a multi-size favicon.ico and the Safari
 * pinned-tab mask. Run after editing the mark.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const PUBLIC = join(process.cwd(), "public");
const SOURCE = join(process.cwd(), "assets-raw", "brand-mark.svg");

/** Standalone PNGs. Legacy names are kept so existing references stay valid. */
const PNGS = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["icon-light-32x32.png", 32],
  ["icon-dark-32x32.png", 32],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-icon.png", 180],
  ["apple-touch-icon.png", 180],
  ["apple-touch-icon-precomposed.png", 180],
];

/** Sizes embedded in favicon.ico — what Windows and legacy crawlers read. */
const ICO_SIZES = [16, 32, 48];

const svg = readFileSync(SOURCE);

const render = (size) =>
  sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/**
 * Build an .ico wrapping one PNG per size. PNG-in-ICO is understood by every
 * browser in use and avoids the 256-colour BMP path entirely.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const directory = [];

  for (const { size, data } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    directory.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...directory, ...entries.map((e) => e.data)]);
}

for (const [name, size] of PNGS) {
  writeFileSync(join(PUBLIC, name), await render(size));
  console.log(`${name} (${size}px)`);
}

/**
 * Android adaptive icons crop to a circle covering the middle 80%, so the
 * maskable variant insets the tile far enough that no corner is clipped.
 */
const MASKABLE = 512;
const MASKABLE_INSET = 86;
writeFileSync(
  join(PUBLIC, "icon-maskable-512.png"),
  await sharp({
    create: {
      width: MASKABLE,
      height: MASKABLE,
      channels: 4,
      background: "#FFFFFF",
    },
  })
    .composite([{ input: await render(MASKABLE - MASKABLE_INSET * 2), top: MASKABLE_INSET, left: MASKABLE_INSET }])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);
console.log(`icon-maskable-512.png (${MASKABLE}px)`);

const icoEntries = [];
for (const size of ICO_SIZES) {
  icoEntries.push({ size, data: await render(size) });
}
writeFileSync(join(PUBLIC, "favicon.ico"), buildIco(icoEntries));
console.log(`favicon.ico (${ICO_SIZES.join(", ")}px)`);

writeFileSync(join(PUBLIC, "icon.svg"), svg);
console.log("icon.svg");

/** Safari pinned tabs render a single-colour silhouette, so strip the tile. */
const maskIcon = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M71 28h370v456H71zM247 71h18v398h-18zM85 85h100v143H85zM156 284h29v143h-29zM327 85h29v143h-29zM327 284h100v143H327z" />
</svg>
`;
writeFileSync(join(PUBLIC, "safari-pinned-tab.svg"), maskIcon);
console.log("safari-pinned-tab.svg");
