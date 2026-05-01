"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; delivered: boolean }
  | { status: "error"; message: string };

/**
 * Contact form — client-side controller.
 *
 * Wires:
 *  • Visually-hidden honeypot (`_hp`) — must remain empty.
 *  • Submit-time stamp (`_t`) — read on the server to reject sub-second
 *    bot submissions.
 *  • Optimistic state machine (idle → loading → success | error).
 *  • Privacy-policy linkage so the form is GDPR-friendly without a
 *    pop-up consent block above it.
 */
export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const formMounted = useRef<number>(Date.now());

  useEffect(() => {
    formMounted.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      _hp: String(fd.get("_hp") ?? ""),
      _t: formMounted.current,
    };

    setState({ status: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        delivered?: boolean;
      };

      if (!res.ok) {
        setState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setState({
        status: "success",
        delivered: data.delivered === true,
      });
      form.reset();
    } catch {
      setState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  const loading = state.status === "loading";

  return (
    <form className="mt-10 max-w-xl space-y-6" onSubmit={onSubmit} noValidate>
      <div
        className="min-h-[1.25rem] text-sm"
        role="status"
        aria-live="polite"
      >
        {state.status === "success" && (
          <p className="text-foreground">
            Thank you — your message has been received.
            {!state.delivered && (
              <>
                {" "}
                Our team also monitors{" "}
                <a
                  className="underline underline-offset-2 hover:text-foreground"
                  href="mailto:info@taban-niroo.com"
                >
                  info@taban-niroo.com
                </a>
                .
              </>
            )}
          </p>
        )}
        {state.status === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </div>

      {/*
        Honeypot field. Hidden from sighted users (off-screen + aria-hidden +
        tabindex -1) but easy for naive bots to fill in. The server rejects
        submissions where this is non-empty.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label htmlFor="_hp">Leave this field empty</label>
        <input
          id="_hp"
          name="_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="name">
          Name
        </label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="company"
        >
          Company
        </label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="Organization name"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="message"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          placeholder="Briefly describe your project, application, or enquiry."
          rows={5}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          className="rounded-full px-6"
          disabled={loading}
        >
          {loading ? "Sending…" : "Send message"}
        </Button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          By sending, you agree to our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
