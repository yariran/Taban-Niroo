import { expect, test, type Page } from "@playwright/test";

const BREAKPOINTS = [375, 768, 1024, 1440] as const;
const LOCALES = ["en", "fa"] as const;

/** Skip intro + consent chrome so layout measurements are stable. */
async function gotoReady(page: Page, path: string) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("tn:consent:v1", "decline");
      sessionStorage.setItem("tn-intro-v2", "1");
    } catch {
      /* storage disabled */
    }
  });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#main-content")).toBeVisible();
}

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(async () => {
    const overflows = () => {
      const doc = document.documentElement;
      // 1px slack for subpixel rounding / scrollbars.
      return (
        Math.max(doc.scrollWidth, document.body.scrollWidth) >
        Math.ceil(doc.clientWidth) + 1
      );
    };

    if (overflows()) return true;

    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += 900) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
      if (overflows()) return true;
    }
    window.scrollTo(0, 0);
    return overflows();
  });
}

test.describe("i18n locale switch", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("switching language keeps the same page and query", async ({ page }) => {
    await gotoReady(page, "/en/products?ref=e2e");

    const persian = page
      .getByRole("link", { name: "Switch to Persian" })
      .first();
    await expect(persian).toBeVisible();
    await expect(persian).toHaveAttribute("href", /\/fa\/products\?ref=e2e/);

    await persian.click();
    await expect(page).toHaveURL(/\/fa\/products\?ref=e2e/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");

    const english = page
      .getByRole("link", { name: "Switch to English" })
      .first();
    await expect(english).toHaveAttribute("href", /\/en\/products\?ref=e2e/);
    await english.click();
    await expect(page).toHaveURL(/\/en\/products\?ref=e2e/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("language links preserve hash in href", async ({ page }) => {
    await gotoReady(page, "/en/contact");
    // Hash is client-side; set it then assert the switcher href includes it.
    await page.evaluate(() => {
      window.location.hash = "main-content";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    await expect(
      page.getByRole("link", { name: "Switch to Persian" }).first(),
    ).toHaveAttribute("href", /\/fa\/contact#main-content/);
  });
});

test.describe("i18n document direction", () => {
  test("/fa sets dir=rtl and lang=fa", async ({ page }) => {
    await page.goto("/fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  });

  test("/en sets dir=ltr and lang=en", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("bare path redirects to default locale", async ({ page }) => {
    const res = await page.goto("/products");
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/en\/products\/?$/);
  });
});

test.describe("i18n no horizontal overflow", () => {
  for (const locale of LOCALES) {
    for (const width of BREAKPOINTS) {
      test(`${locale} home @ ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoReady(page, `/${locale}`);
        expect(
          await hasHorizontalOverflow(page),
          `horizontal overflow on /${locale} at ${width}px`,
        ).toBe(false);
      });
    }
  }

  // One interior page each locale at the extremes (mobile + wide).
  for (const locale of LOCALES) {
    for (const width of [375, 1440] as const) {
      test(`${locale} products @ ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoReady(page, `/${locale}/products`);
        expect(
          await hasHorizontalOverflow(page),
          `horizontal overflow on /${locale}/products at ${width}px`,
        ).toBe(false);
      });
    }
  }
});
