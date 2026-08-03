import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCmsAuthResponse, requireCmsMutation } from "@/lib/cms-api";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonError, jsonOk, jsonTooMany } from "@/lib/api/response";
import {
  readBlogManifest,
  slugify,
  writeBlogManifest,
  type BlogPost,
} from "@/lib/cms-blog";
import { rateLimit } from "@/lib/rate-limit";
import { blogPatchSchema } from "@/lib/schemas/cms";

type Ctx = { params: Promise<{ id: string }> };

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function GET(_request: Request, ctx: Ctx) {
  const denied = await requireCmsAuthResponse();
  if (denied) return denied;
  const { id } = await ctx.params;
  const { posts } = await readBlogManifest();
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return jsonError(404, "Not found", { code: "not_found" });
  }
  return NextResponse.json(post);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const { id } = await ctx.params;
  const parsed = await parseJsonBody(request, blogPatchSchema);
  if (!parsed.ok) return parsed.response;

  const { posts } = await readBlogManifest();
  const index = posts.findIndex((p) => p.id === id);
  if (index < 0) {
    return jsonError(404, "Not found", { code: "not_found" });
  }

  const current = posts[index]!;
  const patch = parsed.data;
  const now = new Date().toISOString();
  const status =
    patch.status === "published" || patch.status === "draft"
      ? patch.status
      : current.status;

  const next: BlogPost = {
    ...current,
    ...patch,
    id: current.id,
    slug: slugify(String(patch.slug ?? current.slug)) || current.slug,
    title: String(patch.title ?? current.title).trim() || current.title,
    excerpt: String(patch.excerpt ?? current.excerpt),
    body: String(patch.body ?? current.body),
    coverImage:
      patch.coverImage === undefined ? current.coverImage : patch.coverImage,
    status,
    publishedAt:
      status === "published" ? (current.publishedAt ?? now) : null,
    updatedAt: now,
  };

  if (posts.some((p, i) => i !== index && p.slug === next.slug)) {
    return jsonError(409, "slug already exists", { code: "conflict" });
  }

  const nextPosts = [...posts];
  nextPosts[index] = next;
  await writeBlogManifest(nextPosts);
  revalidateBlog(current.slug);
  revalidateBlog(next.slug);
  return jsonOk({ ok: true, post: next });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = await requireCmsMutation(request);
  if (denied) return denied;

  const limited = await rateLimit(request, "cms-mutate");
  if (!limited.ok) {
    return jsonTooMany("Too many CMS requests.", limited.retryAfterSec);
  }

  const { id } = await ctx.params;
  const { posts } = await readBlogManifest();
  const target = posts.find((p) => p.id === id);
  if (!target) {
    return jsonError(404, "Not found", { code: "not_found" });
  }
  await writeBlogManifest(posts.filter((p) => p.id !== id));
  revalidateBlog(target.slug);
  return jsonOk({ ok: true });
}
