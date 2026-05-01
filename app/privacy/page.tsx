import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How Taban Niroo handles personal data collected through this website — analytics, contact submissions, retention and your rights.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "31 March 2026";

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="01 · Privacy"
      title="Privacy notice."
      lede="We keep things minimal: first-party analytics for traffic, encrypted enquiry forms, and zero ad tracking — full stop."
      lastUpdated={LAST_UPDATED}
    >
      <h2>Who we are</h2>
      <p>
        This site is operated by Taban Niroo (Dena Power Line Insulators), a
        manufacturer of high-voltage composite insulators headquartered in
        Shiraz, Iran. References to &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;Taban Niroo&rdquo; in this notice refer to the same legal
        entity.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Anonymous traffic statistics.</strong> Page views, country,
          referrer and device class via Vercel&apos;s first-party Web
          Analytics. No cookies are written for this purpose, and no
          fingerprinting is performed.
        </li>
        <li>
          <strong>Contact form submissions.</strong> Name, email address,
          company (optional) and the body of your message — only when you
          submit the contact form.
        </li>
        <li>
          <strong>Newsletter signups.</strong> Email address only, when you
          opt in to the quarterly engineering brief.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        Traffic statistics are used to understand which catalogue references
        are read most and to improve documentation. Enquiries received via the
        contact form are processed solely to reply to you. We never sell or
        share your data with advertisers.
      </p>

      <h2>Retention</h2>
      <p>
        Enquiry emails are kept for as long as needed to maintain the
        commercial relationship and afterwards in accordance with applicable
        retention periods for business correspondence. Anonymous traffic data
        is retained for up to 12 months in aggregate form.
      </p>

      <h2>Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of any personal
        data you have submitted via the contact form by writing to{" "}
        <a href="mailto:info@taban-niroo.com">info@taban-niroo.com</a>. We
        reply to such requests within 30 days.
      </p>

      <h2>Cookies</h2>
      <p>
        The site uses one local-storage entry to remember whether you have
        seen the cookie / analytics notice. No tracking cookies are set.
      </p>

      <h2>Updates</h2>
      <p>
        We update this notice when our practice changes; the date at the top
        of the page reflects the latest revision. Material changes are
        announced on the homepage for at least 14 days.
      </p>
    </LegalPageShell>
  );
}
