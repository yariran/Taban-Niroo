import { describe, expect, it } from "vitest";
import { mimeMatchesSniff, sniffImageMime } from "@/lib/image-sniff";

describe("image-sniff", () => {
  it("detects JPEG", () => {
    const buf = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, ...Array(12).fill(0)]);
    expect(sniffImageMime(buf)).toBe("image/jpeg");
  });

  it("detects PNG", () => {
    const buf = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]);
    expect(sniffImageMime(buf)).toBe("image/png");
  });

  it("detects GIF", () => {
    const buf = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0, 0, 0, 0, 0, 0,
    ]);
    expect(sniffImageMime(buf)).toBe("image/gif");
  });

  it("detects WebP", () => {
    const buf = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    ]);
    expect(sniffImageMime(buf)).toBe("image/webp");
  });

  it("rejects unknown bytes", () => {
    expect(sniffImageMime(new Uint8Array(16).fill(0))).toBeNull();
  });

  it("matches jpeg aliases", () => {
    expect(mimeMatchesSniff("image/jpg", "image/jpeg")).toBe(true);
    expect(mimeMatchesSniff("image/png", "image/jpeg")).toBe(false);
  });
});
