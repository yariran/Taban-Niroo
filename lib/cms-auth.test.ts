import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  createCmsSession,
  isValidCmsToken,
  verifyCmsCredentials,
} from "@/lib/cms-auth";

describe("cms-auth", () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env.CMS_ADMIN_USERNAME = "admin";
    process.env.CMS_ADMIN_PASSWORD = "test-password-long-enough";
    process.env.CMS_SESSION_SECRET = "unit-test-session-secret-32b";
    process.env.CMS_SESSION_VERSION = "1";
  });

  afterEach(() => {
    process.env = { ...prev };
  });

  it("creates a signed session that validates", () => {
    const token = createCmsSession();
    expect(token).toMatch(/^v1\./);
    expect(isValidCmsToken(token)).toBe(true);
  });

  it("rejects tampered sessions", () => {
    const token = createCmsSession()!;
    const bad = token.slice(0, -4) + "xxxx";
    expect(isValidCmsToken(bad)).toBe(false);
  });

  it("rejects legacy password-hash cookies", () => {
    expect(isValidCmsToken("a".repeat(64))).toBe(false);
  });

  it("verifies credentials with timing-safe compare", () => {
    expect(verifyCmsCredentials("admin", "test-password-long-enough")).toBe(
      true,
    );
    expect(verifyCmsCredentials("admin", "wrong")).toBe(false);
    expect(verifyCmsCredentials("nope", "test-password-long-enough")).toBe(
      false,
    );
  });

  it("invalidates sessions when CMS_SESSION_VERSION changes", () => {
    const token = createCmsSession()!;
    process.env.CMS_SESSION_VERSION = "2";
    expect(isValidCmsToken(token)).toBe(false);
  });
});
