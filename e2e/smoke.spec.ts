import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("smoke", () => {
  test("home loads with brand and main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.locator("header").first()).toBeVisible();
  });

  test("product modal opens from catalogue", async ({ page }) => {
    await page.goto("/products");
    const openBtn = page
      .getByRole("button", { name: /Open .+ overview/i })
      .first();
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading").first()).toBeVisible();
  });

  test("contact form surfaces missing-mail config or success", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByLabel(/name/i).fill("E2E Tester");
    await page.getByLabel(/email/i).fill("e2e@example.com");
    await page.getByLabel(/message/i).fill(
      "Playwright smoke test — please ignore.",
    );
    await page.waitForTimeout(1100);
    await page.getByRole("button", { name: /send|submit/i }).click();

    const status = page.getByRole("status");
    await expect(status).toBeVisible({ timeout: 15_000 });
    await expect(status).toContainText(
      /thank you|try again|not configured|unavailable|wrong|resend|email/i,
    );
  });

  test("admin login page rejects bad credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator('input[name="username"]').fill("admin");
    await page.locator('input[name="password"]').fill("definitely-wrong");
    await page.getByRole("button", { name: /ورود/ }).click();
    await expect(
      page.locator("p.text-red-600, p.text-sm.text-red-600"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("checks");
  });
});

test.describe("admin deep", () => {
  test("admin can sign in and open products CMS", async ({ page }) => {
    const password =
      process.env.CMS_ADMIN_PASSWORD || "e2e-admin-password-not-prod";

    await page.goto("/admin/login");
    await page.locator('input[name="username"]').fill("admin");
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: /ورود/ }).click();

    await expect(page).toHaveURL(/\/admin\/?$/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: /خلاصه وضعیت/ }),
    ).toBeVisible();

    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("a11y", () => {
  for (const path of ["/", "/products", "/contact", "/about"] as const) {
    test(`${path} has no critical axe violations`, async ({ page }) => {
      await page.goto(path);
      const accept = page.getByRole("button", {
        name: /accept|agree|اجازه|قبول/i,
      });
      if (await accept.isVisible().catch(() => false)) {
        await accept.click();
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      expect(
        serious,
        serious.map((v) => `${v.id}: ${v.help}`).join("\n"),
      ).toEqual([]);
    });
  }
});
