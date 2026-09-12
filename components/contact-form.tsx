"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LocaleLink, useLocale } from "@/components/locale-link";
import { getDictionarySync } from "@/lib/i18n/dictionary-catalog";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; delivered: boolean }
  | { status: "error"; message: string };

type ContactFormProps = {
  /** Product id from `/contact?ref=` — prefills message + emailed to sales. */
  productRef?: string;
  productName?: string;
};

/**
 * Contact form — client-side controller.
 *
 * Wires:
 *  • Visually-hidden honeypot (`_hp`) — must remain empty.
 *  • Submit-time stamp (`_t`) — read on the server to reject sub-second
 *    bot submissions.
 *  • Optional `productRef` from PDP / catalogue quote CTAs.
 *  • Optimistic state machine (idle → loading → success | error).
 *  • Privacy-policy linkage so the form is GDPR-friendly without a
 *    pop-up consent block above it.
 */
export function ContactForm({
  productRef,
  productName,
}: ContactFormProps = {}) {
  const locale = useLocale();
  const dict = getDictionarySync(locale);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const formMounted = useRef<number>(0);

  const defaultMessage = useMemo(() => {
    if (!productRef && !productName) return "";
    const label = productName?.trim() || productRef;
    return locale === "fa"
      ? `درخواست استعلام / دیتاشیت برای: ${label}.\n\nپروژه / کلاس ولتاژ:\nتعداد تقریبی:\nتوضیحات:\n`
      : `I would like a quotation / technical datasheet for: ${label}.\n\nProject / voltage class:\nQuantity (approx.):\nNotes:\n`;
  }, [productRef, productName, locale]);

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
      productRef: String(fd.get("productRef") ?? "").trim(),
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
          message: data.error ?? dict.contact.error,
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
        message: dict.contact.error,
      });
    }
  }

  const loading = state.status === "loading";
  const refLabel = productName?.trim() || productRef;

  return (
    <form className="mt-10 max-w-xl space-y-6" onSubmit={onSubmit} noValidate>
      <div
        className="min-h-[1.25rem] text-sm"
        role="status"
        aria-live="polite"
      >
        {state.status === "success" && (
          <p className="text-foreground">{dict.contact.success}</p>
        )}
        {state.status === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </div>

      {refLabel ? (
        <p className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-foreground">
          {locale === "fa" ? "مرتبط با " : "Enquiry linked to "}
          <span className="font-medium">{refLabel}</span>
        </p>
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-[-9999px] top-auto h-0 w-0 overflow-hidden"
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

      {productRef ? (
        <input type="hidden" name="productRef" value={productRef} />
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="name">
          {dict.contact.name}
        </label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          {dict.contact.email}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="company"
        >
          {dict.contact.company}
        </label>
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="message"
        >
          {dict.contact.message}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          disabled={loading}
          defaultValue={defaultMessage}
          key={defaultMessage || "blank"}
        />
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          className="min-h-11 w-full rounded-full px-6 sm:w-auto"
          disabled={loading}
        >
          {loading ? dict.contact.sending : dict.contact.send}
        </Button>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {locale === "fa" ? (
            <>
              با ارسال، با{" "}
              <LocaleLink
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {dict.footer.privacy}
              </LocaleLink>{" "}
              موافقت می‌کنید.
            </>
          ) : (
            <>
              By sending, you agree to our{" "}
              <LocaleLink
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                privacy notice
              </LocaleLink>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}
