import { describe, expect, it } from "vitest";
import { mergeSiteContent } from "@/lib/cms-content";
import { emptySiteContent } from "@/lib/cms-content-types";
import { joinLocalized, splitLocalized, t } from "@/lib/i18n/localize";
import { localizeProduct, type Product } from "@/lib/products";

describe("t()", () => {
  it("returns plain strings as-is", () => {
    expect(t("Hello", "en")).toBe("Hello");
    expect(t("Hello", "fa")).toBe("Hello");
  });

  it("falls back from empty fa to en", () => {
    expect(t({ en: "Line post", fa: "" }, "fa")).toBe("Line post");
    expect(t({ en: "Line post" }, "fa")).toBe("Line post");
    expect(t({ en: "Line post", fa: "مقره اتکایی" }, "fa")).toBe(
      "مقره اتکایی",
    );
  });
});

describe("splitLocalized / joinLocalized", () => {
  it("splits plain strings into en-only drafts", () => {
    expect(splitLocalized("Hello")).toEqual({ en: "Hello", fa: "" });
  });

  it("splits bilingual objects", () => {
    expect(splitLocalized({ en: "A", fa: "ب" })).toEqual({
      en: "A",
      fa: "ب",
    });
  });

  it("joins to plain string when fa empty", () => {
    expect(joinLocalized(" Hello ", "  ")).toBe("Hello");
  });

  it("joins to object when fa present", () => {
    expect(joinLocalized("Hello", "سلام")).toEqual({
      en: "Hello",
      fa: "سلام",
    });
  });
});
describe("localizeProduct", () => {
  const sample: Product = {
    id: "sample",
    name: { en: "Line Post", fa: "مقره اتکایی" },
    family: "Silicone Composite Insulators",
    subFamily: "Post",
    catalogueRef: "DPL",
    summary: { en: "EN summary", fa: "خلاصه" },
    applications: "Utility",
    order: 1,
  };

  it("resolves fa text and keeps specs", () => {
    const fa = localizeProduct(sample, "fa");
    expect(fa.name).toBe("مقره اتکایی");
    expect(fa.summary).toBe("خلاصه");
    expect(fa.subFamily).toBe("Post");
    expect(fa.catalogueRef).toBe("DPL");
  });
});

describe("mergeSiteContent", () => {
  it("fills empty fa strings from en", () => {
    const en = emptySiteContent();
    en.home.hero = { title: "English title", body: "English body" };
    const fa = emptySiteContent();
    fa.home.hero = { title: "عنوان فارسی", body: "" };

    const merged = mergeSiteContent(fa, en, "fa");
    expect(merged.home.hero?.title).toBe("عنوان فارسی");
    expect(merged.home.hero?.body).toBe("English body");
  });

  it("uses en block when fa block is missing", () => {
    const en = emptySiteContent();
    en.home.ceo = { title: "CEO" };
    const fa = emptySiteContent();
    const merged = mergeSiteContent(fa, en, "fa");
    expect(merged.home.ceo?.title).toBe("CEO");
  });
});
