#!/usr/bin/env node
/**
 * Lighthouse performance gate for / and /products.
 * Expects a production server already listening (see npm run test:perf).
 *
 * Budgets are lab scores for a cinematic industrial site — not Field CrUX.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.E2E_BASE_URL || "http://127.0.0.1:4173";
const OUT_DIR = join(process.cwd(), ".lighthouse");

const ROUTES = [
  {
    path: "/",
    minScore: 0.55,
    maxLcpMs: 4500,
    maxCls: 0.15,
  },
  {
    path: "/products",
    minScore: 0.6,
    maxLcpMs: 4000,
    maxCls: 0.12,
  },
];

function runLighthouse(url) {
  return new Promise((resolve, reject) => {
    const args = [
      "lighthouse",
      url,
      "--only-categories=performance",
      "--output=json",
      "--output-path=stdout",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--quiet",
      "--form-factor=desktop",
      "--screenEmulation.mobile=false",
      "--throttling-method=devtools",
    ];
    const child = spawn("npx", args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`lighthouse exited ${code}: ${stderr.slice(0, 500)}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function metric(audits, id) {
  const a = audits?.[id];
  return typeof a?.numericValue === "number" ? a.numericValue : null;
}

mkdirSync(OUT_DIR, { recursive: true });

let failed = 0;

for (const route of ROUTES) {
  const url = `${BASE}${route.path}`;
  process.stdout.write(`Lighthouse ${url} … `);
  try {
    const report = await runLighthouse(url);
    const score = report.categories?.performance?.score ?? 0;
    const lcp = metric(report.audits, "largest-contentful-paint");
    const cls = metric(report.audits, "cumulative-layout-shift");
    const slug = route.path === "/" ? "home" : route.path.replace(/\W+/g, "-");
    writeFileSync(join(OUT_DIR, `${slug}.json`), JSON.stringify(report));

    const okScore = score >= route.minScore;
    const okLcp = lcp == null || lcp <= route.maxLcpMs;
    const okCls = cls == null || cls <= route.maxCls;
    const ok = okScore && okLcp && okCls;

    console.log(
      `${ok ? "PASS" : "FAIL"} score=${score.toFixed(2)} LCP=${lcp != null ? Math.round(lcp) + "ms" : "n/a"} CLS=${cls != null ? cls.toFixed(3) : "n/a"}`,
    );
    if (!ok) {
      failed += 1;
      if (!okScore) console.log(`  expected score ≥ ${route.minScore}`);
      if (!okLcp) console.log(`  expected LCP ≤ ${route.maxLcpMs}ms`);
      if (!okCls) console.log(`  expected CLS ≤ ${route.maxCls}`);
    }
  } catch (err) {
    failed += 1;
    console.log("FAIL");
    console.error(err.message || err);
  }
}

if (failed) {
  console.error(`\n${failed} route(s) missed performance budgets.`);
  process.exit(1);
}

console.log("\nAll Lighthouse performance budgets met.");
