"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { tEn } from "@/lib/i18n/localize";

export function ProductsAdminList({
  products,
  sourcedFromCms,
}: {
  products: Product[];
  sourcedFromCms: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = products.filter((p) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      tEn(p.name).toLowerCase().includes(needle) ||
      p.id.toLowerCase().includes(needle) ||
      p.family.toLowerCase().includes(needle) ||
      p.catalogueRef.toLowerCase().includes(needle)
    );
  });

  async function seed() {
    if (
      !window.confirm(
        "کاتالوگ فعلی کد به عنوان داده اولیه CMS بارگذاری شود؟ در صورت وجود داده قبلی، جایگزین می‌شود.",
      )
    ) {
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/cms/products?seed=1");
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus(data.error ?? "خطا در بارگذاری");
        return;
      }
      setStatus("کاتالوگ از کد بارگذاری شد.");
      router.refresh();
    } catch {
      setStatus("خطای شبکه");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("این محصول حذف شود؟")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/cms/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(data.error ?? "حذف ناموفق");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">محصولات</h1>
          <p className="mt-1 text-sm text-[#5a6570]">
            {products.length} محصول ·{" "}
            {sourcedFromCms ? "منبع: CMS" : "منبع: پیش‌فرض کد"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!sourcedFromCms && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void seed()}
              className="rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm disabled:opacity-50"
            >
              بارگذاری از کاتالوگ فعلی
            </button>
          )}
          <Link
            href="/admin/products/new"
            className="rounded-md bg-[#0f1720] px-3 py-2 text-sm text-white"
          >
            افزودن محصول
          </Link>
        </div>
      </div>

      {status && <p className="text-sm text-[#5a6570]">{status}</p>}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجو نام، شناسه، خانواده…"
        className="w-full max-w-md rounded-md border border-[#cfd6de] bg-white px-3 py-2 text-sm"
      />

      <div className="overflow-hidden rounded-xl border border-[#d8dee6] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#f4f6f8] text-end text-xs text-[#5a6570]">
            <tr>
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">خانواده</th>
              <th className="px-4 py-3 font-medium">شناسه</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-[#e8ecf0]">
                <td className="px-4 py-3 font-medium">{tEn(p.name)}</td>
                <td className="px-4 py-3 text-[#5a6570]">{p.family}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#5a6570]">
                  {p.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[#0f1720] underline underline-offset-2"
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
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-[#5a6570]"
                >
                  موردی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
