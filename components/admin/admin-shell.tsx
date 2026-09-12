"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "خلاصه وضعیت", exact: true },
  { href: "/admin/products", label: "محصولات" },
  { href: "/admin/gallery", label: "گالری محصولات" },
  { href: "/admin/content", label: "محتوای صفحات" },
  { href: "/admin/blog", label: "بلاگ" },
  { href: "/admin/settings", label: "تنظیمات" },
] as const;

export function AdminShell({
  children,
  activePath,
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-s border-[#d8dee6] bg-[#0f1720] text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-xs text-white/50">مدیریت محتوا</p>
          <p className="mt-1 text-sm font-semibold tracking-wide">تابان نیرو</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2 text-sm">
          {NAV.map((item) => {
            const active =
              "exact" in item && item.exact
                ? activePath === item.href
                : activePath === item.href ||
                  activePath.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 transition ${
                  active
                    ? "bg-white/15 font-medium text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            className="w-full rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
            onClick={() => {
              void fetch("/api/cms/logout", { method: "POST" }).then(() => {
                window.location.href = "/admin/login";
              });
            }}
          >
            خروج
          </button>
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-white/40 hover:text-white/70"
          >
            مشاهده سایت
          </Link>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
