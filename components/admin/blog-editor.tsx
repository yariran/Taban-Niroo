"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { BlogPost, BlogPostStatus } from "@/lib/cms-blog";

const inputClass =
  "mt-1.5 w-full rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm";

export function BlogEditor({
  initial,
  isNew,
}: {
  initial?: BlogPost;
  isNew: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [status, setStatus] = useState<BlogPostStatus>(
    initial?.status ?? "draft",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadCover(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "blog");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        url?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "آپلود ناموفق");
        return;
      }
      setCoverImage(data.url);
    } finally {
      setBusy(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      title,
      slug,
      excerpt,
      body,
      coverImage: coverImage || null,
      status,
    };
    try {
      const res = isNew
        ? await fetch("/api/cms/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/cms/blog/${initial!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "ذخیره ناموفق");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("خطای شبکه");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="text-sm text-[#5a6570]">
            ← بازگشت
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">
            {isNew ? "مطلب جدید" : "ویرایش مطلب"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-[#0f1720] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {busy ? "…" : "ذخیره"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <label className="block text-sm text-[#5a6570]">
        عنوان
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          dir="ltr"
        />
      </label>
      <label className="block text-sm text-[#5a6570]">
        اسلاگ URL
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={inputClass}
          dir="ltr"
          placeholder="auto from title if empty on create"
        />
      </label>
      <label className="block text-sm text-[#5a6570]">
        وضعیت
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
          className={inputClass}
        >
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشرشده</option>
        </select>
      </label>
      <label className="block text-sm text-[#5a6570]">
        خلاصه
        <textarea
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={inputClass}
          dir="ltr"
        />
      </label>
      <label className="block text-sm text-[#5a6570]">
        متن کامل
        <textarea
          rows={12}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={inputClass}
          dir="ltr"
        />
      </label>
      <label className="block text-sm text-[#5a6570]">
        تصویر کاور
        <div className="mt-1.5 flex flex-wrap gap-2">
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className={`${inputClass} mt-0 flex-1`}
            dir="ltr"
          />
          <label className="cursor-pointer rounded-md border border-[#cfd6de] px-3 py-2 text-sm">
            آپلود
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadCover(f);
              }}
            />
          </label>
        </div>
      </label>
    </form>
  );
}
