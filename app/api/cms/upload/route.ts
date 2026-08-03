import { requireCmsMutation } from "@/lib/cms-api";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  uploadCmsFile,
  validateImageUpload,
} from "@/lib/cms-store";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = await rateLimit(request, "cms-upload");
  if (!limited.ok) {
    return jsonTooMany("Too many uploads. Try again later.", limited.retryAfterSec);
  }

  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Invalid form data", { code: "invalid_form" });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError(400, "file required", { code: "validation_error" });
  }

  const validated = await validateImageUpload(file);
  if (!validated.ok) {
    return jsonError(400, validated.error, { code: "validation_error" });
  }

  const folder = String(form.get("folder") ?? "uploads").replace(
    /[^a-z0-9_-]/gi,
    "",
  );

  try {
    const asset = await uploadCmsFile(file, folder || "uploads", {
      mime: validated.mime,
      buffer: validated.buffer,
    });
    return jsonOk({ ok: true, ...asset });
  } catch (err) {
    console.error("[cms-upload]", err);
    return jsonError(500, "Upload failed.", { code: "upload_failed" });
  }
}
