import { expect, test, type Page } from "@playwright/test";
import { HOME_CHAPTERS } from "../lib/home-chapters";

/**
 * Guards for the home-page choreography refactor.
 *
 * Each test targets a failure class that previously shipped undetected:
 * dead props nothing read, a parallax engine with no adopters, silently
 * degraded entrances, and sticky elements broken by an ancestor.
 */

const REVEAL_SELECTOR =
  "[data-reveal-block],[data-reveal-text],[data-image-reveal],[data-reveal-up]";

/** Skip brand intro + consent so body scroll is not `position: fixed`. */
async function gotoHome(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("tn-intro-v2", "1");
      localStorage.setItem("tn:consent:v1", "decline");
    } catch {
      /* storage disabled */
    }
  });
  await page.goto("/");
}

test.describe("chapter sentinels", () => {
  test("exactly match HOME_CHAPTERS, one node each", async ({ page }) => {
    await gotoHome(page);

    const ids = await page.$$eval("[data-chapter-id]", (nodes) =>
      nodes.map((n) => (n as HTMLElement).dataset.chapterId),
    );

    // The old design passed `chapter` to eleven wrappers and read it in
    // none, and skipped `index={3}` while claiming `total={12}`. Deriving
    // both from one array makes that unrepresentable — this asserts it.
    expect(ids).toEqual(HOME_CHAPTERS.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("the rail renders one entry per chapter", async ({ page }) => {
    await gotoHome(page);
    // Rail is desktop-only (`hidden lg:block`).
    await page.setViewportSize({ width: 1440, height: 900 });
    const items = page.locator('aside[aria-label="Chapter navigation"] li');
    await expect(items).toHaveCount(HOME_CHAPTERS.length);
  });
});

test.describe("parallax", () => {
  test("stays within budget and never wraps a sticky or a reveal", async ({
    page,
  }) => {
    await gotoHome(page);

    const report = await page.$$eval("[data-parallax]", (nodes) =>
      nodes.map((n) => {
        const el = n as HTMLElement;
        const sticky = Array.from(el.querySelectorAll("*")).some(
          (d) => getComputedStyle(d).position === "sticky",
        );
        return {
          speed: el.dataset.parallax,
          // A node that is itself an ImageReveal would have both this
          // engine and the component writing `style.transform`; last
          // writer wins and one effect vanishes with no error.
          isImageReveal: el.dataset.imageReveal !== undefined,
          containsSticky: sticky,
        };
      }),
    );

    expect(report.length).toBeGreaterThan(0);
    // Each node costs a forced layout per scroll frame.
    expect(report.length).toBeLessThanOrEqual(8);
    expect(report.filter((r) => r.isImageReveal)).toEqual([]);
    expect(report.filter((r) => r.containsSticky)).toEqual([]);
  });
});

test.describe("sticky sections", () => {
  test("philosophy stage sticks to the viewport top", async ({ page }) => {
    await gotoHome(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    // Lenis mounts in useEffect — wait before programmatic scroll.
    await page.waitForFunction(
      () =>
        Boolean(
          (window as Window & { __tnLenis?: unknown }).__tnLenis,
        ) &&
        ((window as Window & { __tnLenis?: { limit: number } }).__tnLenis
          ?.limit ?? 0) > 0,
      undefined,
      { timeout: 10_000 },
    );

    // The wrapper applies `overflow-x: clip` with `overflow-y: visible`.
    // Pairing the axes (the previous behaviour) creates a scrollport and
    // silently kills the sticky child — that is the bug this guards.
    const overflow = await page.evaluate(() => {
      const sentinel = document.querySelector('[data-chapter-id="philosophy"]');
      const wrapper = sentinel?.parentElement as HTMLElement;
      const cs = getComputedStyle(wrapper);
      return { x: cs.overflowX, y: cs.overflowY };
    });
    expect(overflow.x).toBe("clip");
    expect(overflow.y).toBe("visible");

    const top = await page.evaluate(() => {
      const phil = document.querySelector("#philosophy") as HTMLElement;
      const track = phil.querySelector(
        'div[style*="160vh"]',
      ) as HTMLElement | null;
      if (!track) return null;
      const stage = track.querySelector(".sticky") as HTMLElement | null;
      if (!stage) return null;
      const trackTop = window.scrollY + track.getBoundingClientRect().top;
      // 30% into the runway is comfortably inside the stick window.
      const target = trackTop + track.offsetHeight * 0.3;
      // Lenis owns scroll on fine pointers — native window.scrollTo is a no-op.
      const lenis = (
        window as Window & {
          __tnLenis?: { scrollTo: (v: number, opts?: { immediate?: boolean }) => void };
        }
      ).__tnLenis;
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
      return new Promise<number>((resolve) =>
        setTimeout(
          () => resolve(Math.round(stage.getBoundingClientRect().top)),
          200,
        ),
      );
    });

    expect(top).not.toBeNull();
    expect(Math.abs(top as number)).toBeLessThanOrEqual(4);
  });
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("leaves every reveal fully visible without scrolling", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.waitForTimeout(600);

    /**
     * This is the highest-risk regression in the refactor and the only
     * one a screenshot cannot catch. `globals.css` globally forces
     * `transition-duration: 0.01ms` under reduced motion, so a component
     * that forgot its reduced-motion branch still *looks* correct in a
     * screenshot while sitting at `opacity: 0` forever. Only reading
     * computed style finds it.
     */
    const hidden = await page.$$eval(REVEAL_SELECTOR, (nodes) =>
      nodes
        .filter((n) => parseFloat(getComputedStyle(n).opacity) < 0.99)
        .map((n) => ({
          tag: n.tagName,
          cls: (n as HTMLElement).className.toString().slice(0, 80),
        })),
    );

    expect(hidden).toEqual([]);
  });

  test("hides the chapter rail", async ({ page }) => {
    await gotoHome(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(400);
    await expect(
      page.locator('aside[aria-label="Chapter navigation"]'),
    ).toHaveCount(0);
  });
});
