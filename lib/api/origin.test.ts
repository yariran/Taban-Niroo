import { describe, expect, it } from "vitest";
import { escapeHtml, isValidEmail, singleLine } from "@/lib/rate-limit";
import { assertCmsMutationOrigin } from "@/lib/api/origin";

describe("rate-limit helpers", () => {
  it("validates emails", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("bad")).toBe(false);
  });

  it("strips header injection", () => {
    expect(singleLine("evil\r\nBcc: x@y.z")).toBe("evil  Bcc: x@y.z");
  });

  it("escapes html", () => {
    expect(escapeHtml(`<script>"x"</script>`)).toContain("&lt;script&gt;");
  });
});

describe("assertCmsMutationOrigin", () => {
  it("allows matching origin", () => {
    const req = new Request("http://localhost:3000/api/cms/content", {
      method: "PUT",
      headers: { origin: "http://localhost:3000" },
    });
    expect(assertCmsMutationOrigin(req)).toBeNull();
  });

  it("rejects foreign origin", () => {
    const req = new Request("http://localhost:3000/api/cms/content", {
      method: "PUT",
      headers: { origin: "https://evil.example" },
    });
    const res = assertCmsMutationOrigin(req);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  it("allows internal key bypass", () => {
    process.env.CMS_INTERNAL_KEY = "internal-test-key";
    const req = new Request("http://localhost:3000/api/cms/content", {
      method: "PUT",
      headers: {
        origin: "https://evil.example",
        "x-cms-internal": "internal-test-key",
      },
    });
    expect(assertCmsMutationOrigin(req)).toBeNull();
    delete process.env.CMS_INTERNAL_KEY;
  });
});
