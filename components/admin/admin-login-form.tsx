"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({
  credentialsConfigured,
}: {
  credentialsConfigured: boolean;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    if (!credentialsConfigured) {
      setError(
        "ورود هنوز فعال نیست. CMS_ADMIN_USERNAME و CMS_ADMIN_PASSWORD را در env تنظیم کنید.",
      );
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(
          data.error === "Invalid credentials."
            ? "نام کاربری یا رمز عبور اشتباه است."
            : (data.error ?? "ورود ناموفق بود"),
        );
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("خطای شبکه");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!credentialsConfigured && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-medium">ورود هنوز پیکربندی نشده</p>
          <p className="mt-1.5 leading-relaxed text-[13px]">
            در فایل{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              .env.local
            </code>{" "}
            مقادیر{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              CMS_ADMIN_USERNAME
            </code>{" "}
            و{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              CMS_ADMIN_PASSWORD
            </code>{" "}
            را بگذارید و سرور را ری‌استارت کنید.
          </p>
        </div>
      )}

      <label className="block text-sm">
        <span className="text-[#5a6570]">نام کاربری</span>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          dir="ltr"
          className="mt-1.5 w-full rounded-md border border-[#cfd6de] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f1720]"
          placeholder="admin"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[#5a6570]">رمز عبور</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          dir="ltr"
          className="mt-1.5 w-full rounded-md border border-[#cfd6de] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f1720]"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-[#0f1720] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {busy ? "در حال ورود…" : "ورود"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
