import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms governing your use of the Taban Niroo website — content accuracy, intellectual property and acceptable use.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "31 March 2026";

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="02 · Terms"
      title="Terms of use."
      lede="Plain-English rules of the road for browsing this website. By using the site you agree to the terms below."
      lastUpdated={LAST_UPDATED}
    >
      <h2>1. Information accuracy</h2>
      <p>
        Product references, voltage classes and standards listed on this
        website are provided in good faith and based on the most recent
        Taban Niroo published specifications. We make every reasonable effort to
        keep the information current; however, technical specifications may
        change without notice and the official, signed product datasheet
        always prevails over information published here.
      </p>

      <h2>2. Intellectual property</h2>
      <p>
        All trademarks, logos, photography, technical drawings and editorial
        copy on this website are the property of Taban Niroo unless
        otherwise noted. You may view the content for personal, informational
        use, but you may not reproduce, redistribute or commercially exploit
        any portion without prior written consent.
      </p>

      <h2>3. Acceptable use</h2>
      <p>
        Please do not attempt to disrupt, attack, or otherwise interfere with
        the normal operation of this site. Automated scraping that imposes
        load on our servers — or that attempts to circumvent abuse
        protections on the contact form — is prohibited.
      </p>

      <h2>4. Disclaimer of warranties</h2>
      <p>
        The website is provided on an &ldquo;as is&rdquo; basis. We do not
        warrant that the site will be uninterrupted or error-free, and we
        disclaim all implied warranties to the maximum extent permitted by
        law.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the extent permitted by applicable law, Taban Niroo shall not be
        liable for any indirect, incidental, consequential or punitive
        damages arising out of your use of, or inability to use, this
        website.
      </p>

      <h2>6. Governing law</h2>
      <p>
        These terms are governed by the laws of the Islamic Republic of
        Iran. Any dispute that cannot be resolved amicably shall be
        submitted to the competent courts of Shiraz.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these terms can be addressed to{" "}
        <a href="mailto:info@taban-niroo.com">info@taban-niroo.com</a>.
      </p>
    </LegalPageShell>
  );
}
