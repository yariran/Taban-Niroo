import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { RevealWords, RevealUp } from "@/components/ui/reveal-words";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 pb-24 pt-32 text-center"
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground tabular">
          404
        </p>
        <h1 className="mt-4 max-w-md text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          <RevealWords as="span">Page not found</RevealWords>
        </h1>
        <RevealUp as="p" delay={260} className="mt-4 max-w-sm text-sm text-muted-foreground">
          The page you requested does not exist or has been moved.
        </RevealUp>
        <RevealUp delay={420}>
          <Link
            href="/"
            className="mt-10 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Back to home
          </Link>
        </RevealUp>
      </main>
    </>
  );
}
