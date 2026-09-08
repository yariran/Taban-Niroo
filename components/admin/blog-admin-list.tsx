"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/lib/cms-blog";

export function BlogAdminList({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove(id: string) {
    if (!window.confirm("این مطلب حذف شود؟")) return;
    setBusy(true);
    try {
      await fetch(`/api/cms/blog/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">بلاگ</h1>
          <p className="mt-1 text-sm text-[#5a6570]">{posts.length} مطلب</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-[#0f1720] px-3 py-2 text-sm text-white"
        >
          مطلب جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#d8dee6] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#f4f6f8] text-end text-xs text-[#5a6570]">
            <tr>
              <th className="px-4 py-3 font-medium">عنوان</th>
              <th className="px-4 py-3 font-medium">زبان</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-[#e8ecf0]">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="font-mono text-xs text-[#5a6570]" dir="ltr">
                    /{p.locale}/blog/{p.slug}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {p.locale === "fa" ? "FA" : "EN"}
                </td>
                <td className="px-4 py-3">
                  {p.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="underline underline-offset-2"
                    >
                      ویرایش
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void remove(p.id)}
                      className="text-red-600 disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[#5a6570]">
                  هنوز مطلبی نیست.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
