import type { ZodType } from "zod";
import { jsonError, jsonValidationError } from "@/lib/api/response";
import type { NextResponse } from "next/server";

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/** Parse request JSON and validate with Zod. */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: jsonError(400, "Invalid JSON", { code: "invalid_json" }),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, response: jsonValidationError(parsed.error) };
  }
  return { ok: true, data: parsed.data };
}
