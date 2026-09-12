import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  dirFor,
  isLocale,
  localeHref,
  LOCALES,
  stripLocalePrefix,
  swapLocalePath,
} from "@/lib/i18n";

describe("i18n helpers", () => {
  it("exposes en and fa", () => {
    expect(LOCALES).toEqual(["en", "fa"]);
    expect(DEFAULT_LOCALE).toBe("en");
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("dirFor mirrors rtl for fa", () => {
    expect(dirFor("en")).toBe("ltr");
    expect(dirFor("fa")).toBe("rtl");
  });

  it("localeHref prefixes and preserves hash and query", () => {
    expect(localeHref("fa", "/products")).toBe("/fa/products");
    expect(localeHref("en", "/")).toBe("/en");
    expect(localeHref("fa", "/products#rod")).toBe("/fa/products#rod");
    expect(localeHref("fa", "/products?ref=1")).toBe("/fa/products?ref=1");
    expect(localeHref("en", "/contact?ref=x#form")).toBe(
      "/en/contact?ref=x#form",
    );
    expect(localeHref("en", "/admin")).toBe("/admin");
  });

  it("swapLocalePath keeps the page, query, and hash", () => {
    expect(
      swapLocalePath("/en/products/silicone-composite-insulators", "fa"),
    ).toBe("/fa/products/silicone-composite-insulators");
    expect(swapLocalePath("/fa/products?ref=1#specs", "en")).toBe(
      "/en/products?ref=1#specs",
    );
    expect(swapLocalePath("/en", "fa")).toBe("/fa");
  });

  it("stripLocalePrefix peels the first segment", () => {
    expect(stripLocalePrefix("/fa/about")).toEqual({
      locale: "fa",
      pathname: "/about",
    });
    expect(stripLocalePrefix("/products")).toEqual({
      locale: null,
      pathname: "/products",
    });
  });
});
