import { FooterSection } from "@/components/sections/footer-section";
import { getSiteContent } from "@/lib/cms-content";
import type { ContentBlock } from "@/lib/cms-content-types";
import type { Locale } from "@/lib/i18n";

export async function SiteFooter({
  cms,
  locale,
}: {
  cms?: ContentBlock;
  locale?: Locale;
} = {}) {
  const block = cms ?? (await getSiteContent(locale)).footer;
  return <FooterSection cms={block} />;
}
