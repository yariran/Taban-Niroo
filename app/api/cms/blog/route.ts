import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsAuthResponse, requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  readBlogManifest,
  slugify,
  writeBlogManifest,
  type BlogPost,
} from "@/lib/cms-blog";
import { rateLimit } from "@/lib/rate-limit";
import { blogCreateSchema } from "@/lib/schemas/cms";

function revalidateBlog() {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/sitemap.xml");
}

export async function GET() {
  const denied = await requireCmsAuthResponse();
  if (denied) return denied;
  const manifest = await readBlogManifest();
  return NextResponse.json(manifest, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const parsed = await parseJsonBody(request, blogCreateSchema);
  if (!parsed.ok) return parsed.response;

  const raw = parsed.data;
  const title = raw.title.trim();
  const now = new Date().toISOString();
  const status = raw.status === "published" ? "published" : "draft";
  const post: BlogPost = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    slug: slugify(String(raw.slug || title)) || `post-${Date.now()}`,
    title,
    excerpt: String(raw.excerpt ?? "").trim(),
    body: String(raw.body ?? ""),
    coverImage: raw.coverImage ?? null,
    status,
    publishedAt: status === "published" ? now : null,
    updatedAt: now,
  };

  const { posts } = await readBlogManifest();
  if (posts.some((p) => p.slug === post.slug)) {
    post.slug = `${post.slug}-${post.id.slice(-4)}`;
  }

  await writeBlogManifest([post, ...posts]);
  revalidateBlog();
  if (post.status === "published") {
    revalidatePath(`/blog/${post.slug}`);
  }
  return jsonOk({ ok: true, post });
}
