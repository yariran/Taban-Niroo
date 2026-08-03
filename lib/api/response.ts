import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorBody = {
  error: string;
  code?: string;
  details?: unknown;
};

export function jsonOk<T extends Record<string, unknown>>(
  data: T,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(data, init);
}

export function jsonError(
  status: number,
  error: string,
  opts?: { code?: string; details?: unknown; headers?: HeadersInit },
): NextResponse {
  const body: ApiErrorBody = { error };
  if (opts?.code) body.code = opts.code;
  if (opts?.details !== undefined) body.details = opts.details;
  return NextResponse.json(body, { status, headers: opts?.headers });
}

export function zodDetails(err: ZodError): unknown {
  return err.issues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    message: issue.message,
  }));
}

export function jsonValidationError(err: ZodError): NextResponse {
  return jsonError(400, "Validation failed.", {
    code: "validation_error",
    details: zodDetails(err),
  });
}

export function jsonUnauthorized(
  message = "Unauthorized",
): NextResponse {
  return jsonError(401, message, { code: "unauthorized" });
}

export function jsonTooMany(
  message: string,
  retryAfterSec?: number,
): NextResponse {
  const headers: HeadersInit = {};
  if (retryAfterSec && retryAfterSec > 0) {
    headers["Retry-After"] = String(retryAfterSec);
  }
  return jsonError(429, message, { code: "rate_limited", headers });
}
