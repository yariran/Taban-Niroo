/**
 * Magic-byte image sniffing — do not trust Content-Type alone.
 */

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

export function sniffImageMime(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (PNG.every((b, i) => bytes[i] === b)) {
    return "image/png";
  }

  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return "image/gif";
  }

  // RIFF....WEBP
  const riff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const webp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  if (riff && webp) return "image/webp";

  return null;
}

/** Declared MIME must match sniffed type (jpeg aliases allowed). */
export function mimeMatchesSniff(
  declared: string,
  sniffed: string,
): boolean {
  const a = declared.toLowerCase();
  const b = sniffed.toLowerCase();
  if (a === b) return true;
  if (
    (a === "image/jpg" || a === "image/jpeg") &&
    (b === "image/jpeg" || b === "image/jpg")
  ) {
    return true;
  }
  return false;
}
