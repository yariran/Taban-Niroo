import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { NotFoundCopy } from "@/components/not-found-copy";
import { pageSocialFor } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageSocialFor("notFound", "en", { noIndex: true }),
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 pb-24 pt-32 text-center"
      >
        <NotFoundCopy />
      </main>
    </>
  );
}
