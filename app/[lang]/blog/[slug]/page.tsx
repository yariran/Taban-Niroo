import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticleBody, bodyLeadsWithExcerpt } from "@/components/ui/article-body";
import {
  getAllPublishedPosts,
  getPostBySlug,
} from "@/lib/cms-blog";
import { getSiteContent } from "@/lib/cms-content";
import { absoluteUrl, pageSocial, pageSocialFor } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { localeFromParams } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((p) => ({ lang: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await localeFromParams(params);
  const post = await getPostBySlug(slug, lang);
  if (!post) {
    return pageSocialFor("notFound", lang, { noIndex: true });
  }
  return pageSocial({
    title: post.title,
    description: post.excerpt || post.title,
    path: `/blog/${post.slug}`,
    type: "article",
    imageUrl: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
    imageAlt: post.title,
    publishedTime: post.publishedAt || undefined,
    modifiedTime: post.updatedAt || post.publishedAt || undefined,
    locale: lang,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const lang = await localeFromParams(params);
  const [post, content] = await Promise.all([
    getPostBySlug(slug, lang),
    getSiteContent(lang),
  ]);
  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "Taban Niroo",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "Taban Niroo",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/apple-icon.png`,
      },
    },
    ...(post.coverImage
      ? { image: absoluteUrl(post.coverImage, siteUrl) }
      : {}),
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-36 lg:pb-28">
        <nav className="mb-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            Blog – R&amp;D
          </Link>
          <span aria-hidden> / </span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Article"}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && !bodyLeadsWithExcerpt(post.body, post.excerpt) ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        ) : null}

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="mt-12 max-h-[480px] w-full rounded-2xl object-cover"
          />
        ) : null}

        <ArticleBody source={post.body} />
      </article>

      <SiteFooter cms={content.footer} />
    </main>
  );
}
