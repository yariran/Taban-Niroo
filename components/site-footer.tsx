import { FooterSection } from "@/components/sections/footer-section";
import { getSiteContent } from "@/lib/cms-content";

export async function SiteFooter({
  cms,
}: {
  cms?: Awaited<ReturnType<typeof getSiteContent>>["footer"];
} = {}) {
  const block = cms ?? (await getSiteContent()).footer;
  return <FooterSection cms={block} />;
}
