import { expect, test } from "@playwright/test";
import {
  bodyLockSnapshot,
  declineConsent,
  expectPageScrollable,
  forceIntro,
  skipIntroViaTestFlag,
} from "./helpers/intro";

test.describe("site intro scroll lock", () => {
  test("after a normal intro, body is unlocked and the page scrolls", async ({
    page,
  }) => {
    await declineConsent(page);
    await forceIntro(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-site-intro]")).toBeVisible();
    const during = await page.evaluate(bodyLockSnapshot);
    expect(during.position).toBe("fixed");

    await expect(page.locator("[data-site-intro]")).toHaveCount(0, {
      timeout: 12_000,
    });

    const after = await page.evaluate(bodyLockSnapshot);
    expect(after.position).toBe("");
    expect(after.overflow).toBe("");
    expect(after.top).toBe("");
    expect(after.hasIntro).toBe(false);

    await expectPageScrollable(page);
  });

  test("interrupted intro (reload mid-plate) still unlocks after", async ({
    page,
  }) => {
    await declineConsent(page);
    await forceIntro(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-site-intro]")).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => document.body.style.position))
      .toBe("fixed");

    // Reload while the plate is still up — previous lock styles must not stick.
    await forceIntro(page);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-site-intro]")).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => document.body.style.position))
      .toBe("fixed");

    // Dismiss the way a user would (pointer) — unlock must follow.
    await page.mouse.click(400, 300);
    await expect(page.locator("[data-site-intro]")).toHaveCount(0);

    const after = await page.evaluate(bodyLockSnapshot);
    expect(after.position).toBe("");
    expect(after.overflow).toBe("");

    await expectPageScrollable(page);
  });

  test("prefers-reduced-motion never locks scroll", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await declineConsent(page);
    await forceIntro(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-site-intro]")).toHaveCount(0, {
      timeout: 5_000,
    });

    const snap = await page.evaluate(bodyLockSnapshot);
    expect(snap.hasIntro).toBe(false);
    expect(snap.position).toBe("");
    expect(snap.overflow).toBe("");

    await expectPageScrollable(page);
  });

  test("documented ?tn_intro=skip bypasses the plate", async ({ page }) => {
    await declineConsent(page);
    await forceIntro(page);
    await page.goto("/en?tn_intro=skip", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-site-intro]")).toHaveCount(0, {
      timeout: 5_000,
    });
    expect(await page.evaluate(bodyLockSnapshot)).toMatchObject({
      hasIntro: false,
      position: "",
    });
  });
});

test.describe("site intro test flag helper", () => {
  test("skipIntroViaTestFlag keeps sticky chores scrollable", async ({
    page,
  }) => {
    await declineConsent(page);
    await skipIntroViaTestFlag(page);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-site-intro]")).toHaveCount(0, {
      timeout: 5_000,
    });
    expect(await page.evaluate(() => document.body.style.position)).toBe("");
  });
});
