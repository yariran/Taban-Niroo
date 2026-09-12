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
    expect(body).toHaveProperty("ts");
    // Detail payload is gated behind HEALTH_DETAIL_KEY — public body stays minimal.
    expect(body).not.toHaveProperty("missing");
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

/**
 * Accessibility gate.
 *
 * `color-contrast` used to be switched off here. While it was off the site
 * accumulated 29 failing nodes on / in light and 28 in dark, none of which CI
 * ever mentioned — including the header's primary CTA at 1.4:1, which was
 * simply unreadable. The rule is on now and the suite is green; keep it on.
 *
 * Three things this sweep does that the previous one did not, each because
 * leaving it out hid real failures:
 *
 *  1. BOTH THEMES. Most of what broke was a theme-aware token painted on a
 *     surface that does not invert, so it only failed in one of the two.
 *  2. FULL SCROLL. Scroll-driven sections paint their text as you travel
 *     through them. Auditing the first viewport missed eleven nodes across
 *     /about and /products.
 *  3. A RENDER GUARD. A page that fails to build reports zero violations and
 *     looks exactly like a pass — this happened during the very run that
 *     fixed these. Prove the page is really there before trusting its score.
 *
 * Consent is set through localStorage rather than by clicking Accept: it is
 * deterministic, and it declines rather than opting a test browser in.
 */
const A11Y_PATHS = [
  "/",
  "/products",
  "/contact",
  "/about",
  "/projects",
  "/blog",
  "/privacy",
] as const;

test.describe("a11y", () => {
  for (const path of A11Y_PATHS) {
    for (const scheme of ["light", "dark"] as const) {
      test(`${path} [${scheme}] has no critical axe violations`, async ({
        page,
      }) => {
        const pageErrors: string[] = [];
        page.on("pageerror", (e) => pageErrors.push(String(e)));

        await page.emulateMedia({ colorScheme: scheme });
        await page.addInitScript(() => {
          window.__TN_INTRO_SKIP__ = true;
          try {
            localStorage.setItem("tn:consent:v1", "decline");
          } catch {
            /* storage disabled — banner simply stays up */
          }
        });
        const response = await page.goto(path);
        await page.reload();

        // Wait for hydration to actually paint. Probing straight after
        // reload catches the document mid-render and reports ~24 characters,
        // which then trips the guard below for a reason that has nothing to
        // do with the page being broken.
        await page
          .waitForFunction(
            () => (document.body.innerText || "").trim().length > 500,
            undefined,
            { timeout: 15_000 },
          )
          .catch(() => {
            /* let the assertions report what actually rendered */
          });

        const health = await page.evaluate(() => ({
          // The dev overlay element is always present in dev, so its presence
          // proves nothing — probe for the error's own text instead.
          broken: /Build Error|Parsing ecmascript|Unhandled Runtime Error/.test(
            document.body.innerText || "",
          ),
          headings: document.querySelectorAll("h1").length,
          chars: (document.body.innerText || "").trim().length,
          header: !!document.querySelector("header"),
        }));
        expect(response?.status(), `${path} HTTP status`).toBeLessThan(400);
        expect(health.broken, `${path} shows a build error`).toBe(false);
        expect(health.headings, `${path} h1 count`).toBeGreaterThan(0);
        expect(health.chars, `${path} rendered text`).toBeGreaterThan(500);
        expect(health.header, `${path} header present`).toBe(true);
        expect(pageErrors, `${path} runtime errors`).toEqual([]);

        // Travel the page so scroll-driven text reaches its painted state.
        const docHeight = await page.evaluate(
          () => document.documentElement.scrollHeight,
        );
        for (let y = 0; y < docHeight; y += 1200) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(150);
        }
        await page.waitForTimeout(600);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        const serious = results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious",
        );
        expect(
          serious,
          serious
            .map(
              (v) =>
                `${v.id} (${v.nodes.length}): ${v.help}\n` +
                v.nodes
                  .slice(0, 4)
                  .map((n) => `    ${n.target.join(" ")}`)
                  .join("\n"),
            )
            .join("\n"),
        ).toEqual([]);
      });
    }
  }
});
