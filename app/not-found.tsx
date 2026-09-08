import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
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
        <p className="text-xs uppercase tracking-widest text-muted-foreground tabular">
          404
        </p>
        <h1 className="mt-4 max-w-md font-hero-slogan text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          <RevealWords as="span">Page not found</RevealWords>
        </h1>
        <RevealUp className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you requested does not exist or has been moved.
        </RevealUp>
        <Link
          href="/en"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
        >
          Back to home
        </Link>
      </main>
    </>
  );
}
