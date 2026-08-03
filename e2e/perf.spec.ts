import { test, expect } from "@playwright/test";

/**
 * Lab budgets for key routes. Thresholds are calibrated for a cinematic
 * industrial homepage (hero image + motion) running on CI Chromium —
 * not Field CrUX. Tighten after real RUM baselines exist.
 */
const BUDGETS = {
  home: { lcpMs: 4500, cls: 0.15, score: 0.55 },
  products: { lcpMs: 4000, cls: 0.12, score: 0.6 },
} as const;

async function collectWebVitals(page: import("@playwright/test").Page) {
  return page.evaluate(async () => {
    const wait = (ms: number) =>
      new Promise<void>((r) => window.setTimeout(r, ms));

    let lcp = 0;
    let cls = 0;

    try {
      const lcpEntries = performance.getEntriesByType(
        "largest-contentful-paint",
      ) as PerformanceEntry[];
      if (lcpEntries.length) {
        lcp = lcpEntries[lcpEntries.length - 1]?.startTime ?? 0;
      }
    } catch {
      /* older engines */
    }

    const poLcp = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        lcp = entry.startTime;
      }
    });
    try {
      poLcp.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* ignore */
    }

    const poCls = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        hadRecentInput?: boolean;
        value?: number;
      })[]) {
        if (!entry.hadRecentInput) cls += entry.value ?? 0;
      }
    });
    try {
      poCls.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* ignore */
    }

    await wait(2500);
    poLcp.disconnect();
    poCls.disconnect();

    return { lcp, cls };
  });
}

test.describe("perf budgets", () => {
  test("home LCP/CLS within budget", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Dismiss consent so it does not inflate CLS after paint.
    const accept = page.getByRole("button", { name: /accept/i });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
    const { lcp, cls } = await collectWebVitals(page);
    expect(lcp, `home LCP ${lcp}ms`).toBeLessThan(BUDGETS.home.lcpMs);
    expect(cls, `home CLS ${cls}`).toBeLessThan(BUDGETS.home.cls);
  });

  test("products LCP/CLS within budget", async ({ page }) => {
    await page.goto("/products", { waitUntil: "networkidle" });
    const accept = page.getByRole("button", { name: /accept/i });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
    const { lcp, cls } = await collectWebVitals(page);
    expect(lcp, `products LCP ${lcp}ms`).toBeLessThan(BUDGETS.products.lcpMs);
    expect(cls, `products CLS ${cls}`).toBeLessThan(BUDGETS.products.cls);
  });
});
