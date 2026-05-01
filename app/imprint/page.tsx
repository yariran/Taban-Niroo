import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Imprint",
  description:
    "Legal information for the Taban Niroo (Dena Power Line Insulators) corporate website.",
  alternates: { canonical: "/imprint" },
};

const LAST_UPDATED = "31 March 2026";

export default function ImprintPage() {
  return (
    <LegalPageShell
      eyebrow="03 · Imprint"
      title="Imprint."
      lede="Legal information about the operator of this website, in line with international transparency expectations."
      lastUpdated={LAST_UPDATED}
    >
      <h2>Operator</h2>
      <p>
        <strong>Taban Niroo</strong>
        <br />
        Dena Power Line Insulators · DPL
      </p>

      <h2>Headquarters</h2>
      <p>
        Taban Niroo Bldg
        <br />
        Shiraz Special Economic Zone
        <br />
        Shiraz, Fars Province
        <br />
        Islamic Republic of Iran
      </p>

      <h2>Tehran office</h2>
      <p>
        Office 9, No 64, Saeedi Avenue
        <br />
        Africa Street
        <br />
        Tehran, Islamic Republic of Iran
      </p>

      <h2>Contact</h2>
      <p>
        Phone: <a href="tel:+987137175115">+98 71 3717 5115</a>
        <br />
        Fax: +98 21 2629 3990
        <br />
        Email:{" "}
        <a href="mailto:info@taban-niroo.com">info@taban-niroo.com</a>
        <br />
        Web:{" "}
        <a
          href="https://www.taban-niroo.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          taban-niroo.com
        </a>
      </p>

      <h2>Founded</h2>
      <p>1998</p>

      <h2>Sector</h2>
      <p>
        High-voltage composite insulators · power transmission &amp;
        distribution accessories. Type-tested in accredited laboratories
        per IEC 61109, IEC 62217, IEC 60137, IEC 60099-4 and related
        standards.
      </p>

      <h2>Editorial responsibility</h2>
      <p>
        Editorial responsibility for the content of this website rests
        with the marketing department of Taban Niroo at the
        headquarters address above.
      </p>
    </LegalPageShell>
  );
}
