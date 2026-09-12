import type { Page } from "@playwright/test";

/**
 * Documented automation flag for SiteIntro (`components/site-intro.tsx`).
 * Prefer this over writing `tn-intro-v2` into sessionStorage — that hid the
 * scroll-lock bug instead of exercising (or intentionally bypassing) it.
 *
 * Equivalent URL form: `?tn_intro=skip`
 */
export async function skipIntroViaTestFlag(page: Page) {
  await page.addInitScript(() => {
    window.__TN_INTRO_SKIP__ = true;
  });
}

/** Decline cookie chrome without touching intro state. */
export async function declineConsent(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("tn:consent:v1", "decline");
    } catch {
      /* storage disabled */
    }
  });
}

/** Force a first-visit intro (clears session + dataset). Does not clear skip flag. */
export async function forceIntro(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.removeItem("tn-intro-v2");
    } catch {
      /* ignore */
    }
    try {
      delete document.documentElement.dataset.tnIntro;
    } catch {
      /* ignore */
    }
  });
}

export function bodyLockSnapshot() {
  const body = document.body;
  return {
    position: body.style.position,
    overflow: body.style.overflow,
    top: body.style.top,
    hasIntro: Boolean(document.querySelector("[data-site-intro]")),
  };
}

export async function expectPageScrollable(page: Page) {
  await page.waitForFunction(
    () =>
      ((window as Window & { __tnLenis?: { limit: number } }).__tnLenis?.limit ??
        document.documentElement.scrollHeight - window.innerHeight) > 0,
    undefined,
    { timeout: 10_000 },
  );
  await page.evaluate(() => {
    const lenis = (
      window as Window & {
        __tnLenis?: {
          resize?: () => void;
          scrollTo: (y: number, o?: { immediate?: boolean }) => void;
        };
      }
    ).__tnLenis;
    lenis?.resize?.();
    if (lenis) lenis.scrollTo(1400, { immediate: true });
    else window.scrollTo(0, 1400);
  });
  await page.waitForTimeout(200);
  const y = await page.evaluate(
    () =>
      (window as Window & { __tnLenis?: { scroll: number } }).__tnLenis?.scroll ??
      window.scrollY,
  );
  if (y <= 100) {
    throw new Error(`expected scroll position > 100, got ${y}`);
  }
}
