#!/usr/bin/env node
/**
 * Validates production-critical env vars.
 * Usage:
 *   npm run check-env              # local .env.local (informational)
 *   npm run check-env -- --strict  # exit 1 if anything required is missing
 *
 * Loads .env.local manually so it works without Next.js.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(name) {
  const file = resolve(process.cwd(), name);
  if (!existsSync(file)) return;
  const raw = readFileSync(file, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const strict = process.argv.includes("--strict");

const REQUIRED = [
  ["CMS_ADMIN_PASSWORD", "Admin login"],
  ["CMS_SESSION_SECRET", "CMS session HMAC (≥16 chars)"],
  ["BLOB_READ_WRITE_TOKEN", "Persistent CMS storage on Vercel"],
  ["RESEND_API_KEY", "Contact form delivery"],
  ["RESEND_FROM_EMAIL", "Contact From address"],
  ["UPSTASH_REDIS_REST_URL", "Durable rate limiting"],
  ["UPSTASH_REDIS_REST_TOKEN", "Durable rate limiting"],
  ["NEXT_PUBLIC_SITE_URL", "Canonical site URL"],
];

let missing = 0;
console.log("Taban Niroo — production env check\n");

for (const [key, hint] of REQUIRED) {
  const val = process.env[key]?.trim() ?? "";
  let ok = val.length > 0;
  if (key === "CMS_SESSION_SECRET" && ok && val.length < 16) ok = false;
  const mark = ok ? "OK " : "MISS";
  console.log(`  [${mark}] ${key} — ${hint}`);
  if (!ok) missing += 1;
}

console.log("");
if (missing === 0) {
  console.log("All production-critical variables are set.");
  process.exit(0);
}

console.log(`${missing} required variable(s) missing or invalid.`);
console.log(
  "Fill them in Vercel → Project → Settings → Environment Variables (or .env.local for local).",
);
console.log("See .env.example for the full list.\n");

if (strict) {
  process.exit(1);
}
process.exit(0);
