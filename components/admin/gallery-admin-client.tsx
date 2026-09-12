"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery-cms";

type Status = { kind: "idle" } | { kind: "ok"; text: string } | { kind: "err"; text: string };

export function GalleryAdminClient({
  passwordConfigured,
  blobConfigured,
  embedded = false,
}: {
  passwordConfigured: boolean;
  blobConfigured: boolean;
  /** When true, skip login UI (parent page already requires auth). */
  embedded?: boolean;
}) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/cms/gallery", { cache: "no-store" });
    const data = (await res.json()) as { items?: GalleryItem[] };
    setItems(Array.isArray(data.items) ? data.items : []);
  }, []);

  const probeAuth = useCallback(async () => {
    setChecking(true);
    try {
      // Authenticated probe: PUT with empty identical list is heavy; use DELETE of missing id → 401/404
      const res = await fetch("/api/cms/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "__probe__" }),
      });
      setAuthed(res.status !== 401);
      if (res.status !== 401) await load();
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, [load]);

  useEffect(() => {
    if (embedded) {
      setAuthed(true);
      setChecking(false);
      void load();
      return;
    }
    void probeAuth();
  }, [probeAuth, embedded, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus({ kind: "err", text: data.error ?? "Login failed" });
        return;
      }
      setPassword("");
      setAuthed(true);
      await load();
      setStatus({ kind: "ok", text: "Signed in" });
    } catch {
      setStatus({ kind: "err", text: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/cms/logout", { method: "POST" });
    setAuthed(false);
    setItems([]);
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const files = fileRef.current?.files;
    if (!files?.length) {
      setStatus({ kind: "err", text: "Choose at least one image" });
      return;
    }
    setBusy(true);
    setStatus({ kind: "idle" });
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      if (alt.trim()) fd.append("alt", alt.trim());
      const res = await fetch("/api/cms/gallery", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        items?: GalleryItem[];
      };
      if (!res.ok) {
        setStatus({ kind: "err", text: data.error ?? "Upload failed" });
        return;
      }
      setItems(data.items ?? []);
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
      setStatus({
        kind: "ok",
        text: `Uploaded ${(data.items && files.length) || files.length} file(s)`,
      });
    } catch {
      setStatus({ kind: "err", text: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function saveOrder(next: GalleryItem[], message = "Saved") {
    setBusy(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/cms/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: next }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        items?: GalleryItem[];
      };
      if (!res.ok) {
        setStatus({ kind: "err", text: data.error ?? "Save failed" });
        return;
      }
      setItems(data.items ?? next);
      setStatus({ kind: "ok", text: message });
    } catch {
      setStatus({ kind: "err", text: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image from the gallery?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/cms/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        items?: GalleryItem[];
      };
      if (!res.ok) {
        setStatus({ kind: "err", text: data.error ?? "Delete failed" });
        return;
      }
      setItems(data.items ?? []);
      setStatus({ kind: "ok", text: "Deleted" });
    } catch {
      setStatus({ kind: "err", text: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j]!, next[index]!];
    setItems(next);
    void saveOrder(next, "Order updated");
  }

  function updateAltLocal(id: string, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, alt: value } : item)),
    );
  }

  if (checking) {
    return (
      <p className="text-sm text-muted-foreground">Checking session…</p>
    );
  }

  if (!passwordConfigured) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm">
        <p className="font-medium text-foreground">CMS not configured</p>
        <p className="mt-2 text-muted-foreground">
          Set <code className="font-mono text-xs">CMS_ADMIN_PASSWORD</code> in
          the server environment, then redeploy.
        </p>
      </div>
    );
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the CMS password to manage product gallery photos.
        </p>
        <label className="block text-xs uppercase tracking-wider text-muted-foreground">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {status.kind === "err" && (
          <p className="text-sm text-destructive">{status.text}</p>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {items.length} image{items.length === 1 ? "" : "s"} in product
            gallery
          </p>
          {!blobConfigured && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              Dev mode: files save under{" "}
              <code className="font-mono">public/uploads/cms</code>. On
              Vercel set <code className="font-mono">BLOB_READ_WRITE_TOKEN</code>
              .
            </p>
          )}
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        )}
      </div>

      {status.kind !== "idle" && (
        <p
          className={
            status.kind === "ok" ? "text-sm text-foreground" : "text-sm text-destructive"
          }
        >
          {status.text}
        </p>
      )}

      <form
        onSubmit={onUpload}
        className="rounded-2xl border border-border/80 bg-card/40 p-5 space-y-4"
      >
        <p className="text-sm font-medium text-foreground">Upload images</p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP or GIF · max 8 MB each · up to 20 files at once
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="block w-full text-sm text-muted-foreground file:me-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-xs file:font-medium file:text-background"
        />
        <label className="block text-xs uppercase tracking-wider text-muted-foreground">
          Default alt text (optional)
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="e.g. Composite cutout fuse"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {busy ? "Working…" : "Upload to gallery"}
        </button>
      </form>

      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-border/70 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-white sm:w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                Alt text
                <input
                  value={item.alt}
                  onChange={(e) => updateAltLocal(item.id, e.target.value)}
                  onBlur={() => void saveOrder(items, "Alt text saved")}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
                />
              </label>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {item.id}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
                className="rounded-full border border-border px-3 py-2 text-xs disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={busy || index === items.length - 1}
                onClick={() => move(index, 1)}
                className="rounded-full border border-border px-3 py-2 text-xs disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(item.id)}
                className="rounded-full border border-destructive/40 px-3 py-2 text-xs text-destructive"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            No CMS images yet. Upload above — until then the homepage shows the
            default product photos from the codebase.
          </li>
        )}
      </ul>
    </div>
  );
}
