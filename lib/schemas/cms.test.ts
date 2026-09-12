import { describe, expect, it } from "vitest";
import {
  blogCreateSchema,
  contactSchema,
  loginSchema,
  productIdSchema,
  productSchema,
} from "@/lib/schemas/cms";

describe("cms schemas", () => {
  it("accepts valid login", () => {
    const r = loginSchema.safeParse({
      username: "admin",
      password: "secret",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty login", () => {
    expect(loginSchema.safeParse({ username: "", password: "x" }).success).toBe(
      false,
    );
  });

  it("validates kebab-case product ids", () => {
    expect(productIdSchema.safeParse("long-rod-insulator").success).toBe(true);
    expect(productIdSchema.safeParse("Bad_ID").success).toBe(false);
  });

  it("accepts a minimal product", () => {
    const r = productSchema.safeParse({
      id: "test-product",
      name: "Test",
      family: "Silicone Composite Insulators",
      subFamily: "Long Rod",
      catalogueRef: "TN-1",
      summary: "Summary",
      applications: "Apps",
      order: 1,
    });
    expect(r.success).toBe(true);
  });

  it("accepts localized product text fields (name stays plain Latin)", () => {
    const r = productSchema.safeParse({
      id: "test-product",
      name: "Line Post",
      family: "Silicone Composite Insulators",
      subFamily: { en: "Post", fa: "اتکایی" },
      catalogueRef: "TN-1",
      summary: { en: "Summary", fa: "خلاصه" },
      applications: { en: "Apps" },
      order: 1,
    });
    expect(r.success).toBe(true);
  });

  it("rejects bilingual object for product name", () => {
    const r = productSchema.safeParse({
      id: "test-product",
      name: { en: "Line Post", fa: "مقره اتکایی" },
      family: "Silicone Composite Insulators",
      subFamily: "Post",
      catalogueRef: "TN-1",
      summary: "Summary",
      applications: "Apps",
      order: 1,
    });
    expect(r.success).toBe(false);
  });

  it("validates contact payload", () => {
    const ok = contactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there, this is long enough.",
      company: "",
      productRef: "long-rod-distribution",
      _hp: "",
      _t: Date.now(),
    });
    expect(ok.success).toBe(true);

    const bad = contactSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      message: "short",
    });
    expect(bad.success).toBe(false);

    const badRef = contactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there, this is long enough.",
      productRef: "Bad_ID",
    });
    expect(badRef.success).toBe(false);
  });

  it("requires blog title", () => {
    expect(blogCreateSchema.safeParse({ title: "Hello" }).success).toBe(true);
    expect(blogCreateSchema.safeParse({ title: "" }).success).toBe(false);
  });
});
