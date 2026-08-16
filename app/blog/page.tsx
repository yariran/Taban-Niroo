import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RnDCinemaOpening } from "@/components/sections/rnd-cinema-opening";
import { RnDOverviewSection } from "@/components/sections/rnd-overview-section";
import { RnDCinemaCriteria } from "@/components/sections/rnd-cinema-criteria";
import { HybridDevelopmentSection } from "@/components/sections/hybrid-development-section";
import { PatentsSection } from "@/components/sections/patents-section";
import { getPublishedPosts } from "@/lib/cms-blog";
import { getSiteContent } from "@/lib/cms-content";
import { pageSocial } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageSocial({
    title: "Blog – R&D",
    description:
      "Research, testing, and field experience from Taban Niroo’s R&D team. IEC-based design for demanding electrical and environmental conditions.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [posts, content] = await Promise.all([
    getPublishedPosts(),
    getSiteContent(),
  ]);
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />

      {/* R&D story — the engineering the article list reports on. Sits
          above the articles so the page reads as a capability page first
          and a feed second.

          Order is an argument: the overview claims the work starts as a
          calculation, the next two sections evidence the two efforts it
          names, and Patents closes with what those efforts got registered
          as — outcome last, so the claim is paid off before the feed.

          Acts I and II carry that argument cinematically; both collapse to
          their original static rendering under reduced motion. */}
      <RnDCinemaOpening cms={content.blog?.hero} />
      <RnDOverviewSection cms={content.blog?.rndOverview} />
      <RnDCinemaCriteria cms={content.blog?.pollution} />
      <HybridDevelopmentSection cms={content.blog?.hybrid} />
      <PatentsSection cms={content.blog?.patents} />

      <section className="bg-background">
        <div className="px-6 pb-24 md:px-12 md:pb-28 lg:px-20 lg:pb-32">
          <p className="mb-10 border-t border-border pt-12 text-xs font-semibold uppercase tracking-widest text-brand-burgundy md:mb-12 md:pt-16">
            Articles &amp; field notes
          </p>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-6 backdrop-blur"
                >
                  <div>
                    <p className="text-xs uppercase tracking-widest text-brand-burgundy font-semibold">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "Article"}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold text-brand-navy">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline underline-offset-2"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 text-xs font-medium uppercase tracking-wider text-brand-burgundy hover:text-brand-burgundy-strong"
                  >
                    Read article →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-border/80 px-6 py-14 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                R&amp;D notes
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Technical articles on composite insulation, IEC testing, and
                field performance will appear here. Meanwhile, explore the
                product catalogue or send a project enquiry.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-burgundy"
                >
                  View products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-navy/25 px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-navy/50 hover:bg-brand-navy-soft"
                >
                  Contact engineering
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter cms={content.footer} />
    </main>
  );
}
