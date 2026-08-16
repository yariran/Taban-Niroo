import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";
import { pageSocial } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageSocial({
    title: "Page not found",
    description: "The page you requested does not exist or has been moved.",
    path: "/404",
    noIndex: true,
  }),
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
        <RevealUp as="p" delay={260} className="mt-4 max-w-sm text-sm text-muted-foreground">
          The page you requested does not exist or has been moved.
        </RevealUp>
        <RevealUp delay={420}>
          <Link
            href="/"
            className="mt-10 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
          >
            Back to home
          </Link>
        </RevealUp>
      </main>
    </>
  );
}
