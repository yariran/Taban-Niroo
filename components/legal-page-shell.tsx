import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealUp, RevealWords } from "@/components/ui/reveal-words";
import type { ContentBlock } from "@/lib/cms-content";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  lastUpdated: string;
  children: ReactNode;
  footerCms?: ContentBlock;
};

export function LegalPageShell({
  eyebrow,
  title,
  lede,
  lastUpdated,
  children,
  footerCms,
}: LegalPageShellProps) {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-background pb-12 pt-32 md:pt-40">
        <div className="grain-layer opacity-30" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{
            backgroundImage:
              "radial-gradient(120% 70% at 50% 0%, rgb(var(--accent-volt) / 0.08), transparent 55%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-4xl px-6 md:px-12 lg:px-20">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight size={11} aria-hidden strokeWidth={1.7} />
            <span className="text-foreground/80">Legal</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>

          <RevealWords
            as="h1"
            className="mt-6 block font-medium leading-[1.05] tracking-tight text-foreground text-[clamp(2.25rem,5.5vw,3.75rem)]"
          >
            {title}
          </RevealWords>

          {lede && (
            <RevealUp delay={140}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {lede}
              </p>
            </RevealUp>
          )}

          <RevealUp delay={220}>
            <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground/85">
              Last updated · <span className="tabular">{lastUpdated}</span>
            </p>
          </RevealUp>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12 lg:px-0">
          <RevealUp>
            <div className="prose prose-zinc max-w-none text-foreground/85 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:my-1.5 [&_li]:leading-relaxed [&_p]:my-4 [&_p]:leading-relaxed [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 dark:prose-invert">
              {children}
            </div>
          </RevealUp>
        </div>
      </section>

      <SiteFooter cms={footerCms} />
    </main>
  );
}

export function CmsProseBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return <h2 key={i}>{trimmed.slice(3)}</h2>;
        }
        return <p key={i}>{trimmed}</p>;
      })}
    </>
  );
}
