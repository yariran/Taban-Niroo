import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";
import { readBlogManifest } from "@/lib/cms-blog";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditBlogPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { posts } = await readBlogManifest();
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <AdminShell activePath="/admin/blog">
      <BlogEditor isNew={false} initial={post} />
    </AdminShell>
  );
}
