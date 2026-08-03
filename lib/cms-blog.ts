import { readCmsJson, writeCmsJson } from "@/lib/cms-store";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: BlogPostStatus;
  publishedAt: string | null;
  updatedAt: string;
};

export type BlogManifest = {
  version: 1;
  updatedAt: string;
  posts: BlogPost[];
};

const PATHNAME = "cms/blog.json";

function emptyManifest(): BlogManifest {
  return { version: 1, updatedAt: new Date().toISOString(), posts: [] };
}

export async function readBlogManifest(): Promise<BlogManifest> {
  return readCmsJson(PATHNAME, emptyManifest());
}

export async function writeBlogManifest(
  posts: BlogPost[],
): Promise<BlogManifest> {
  const manifest: BlogManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    posts,
  };
  await writeCmsJson(PATHNAME, manifest);
  return manifest;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { posts } = await readBlogManifest();
    return posts
      .filter((p) => p.status === "published")
      .sort((a, b) =>
        (b.publishedAt ?? b.updatedAt).localeCompare(
          a.publishedAt ?? a.updatedAt,
        ),
      );
  } catch {
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
