import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReadingProgress } from "@/components/reading-progress";
import {
  getAdjacentPosts,
  getAvailableLangs,
  getPostBySlug,
  getPosts,
} from "@/lib/content";
import { renderMarkdown } from "@/lib/content/render";
import { OG_LOCALE, getMessages } from "@/lib/i18n/messages";
import { formatLongDate, getSiteUrl, siteConfig } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts("en").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");
  if (!post) return {};

  const url = `${getSiteUrl()}/en/essays/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      siteName: siteConfig.name,
      locale: OG_LOCALE.en,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function EnEssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");

  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const { newer, older } = getAdjacentPosts(slug, "en");
  const url = `${getSiteUrl()}/en/essays/${post.slug}`;
  const t = getMessages("en");
  const otherLangs = getAvailableLangs(slug).filter((l) => l !== "en");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    abstract: post.thesis,
    inLanguage: "en",
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: siteConfig.name, url: getSiteUrl() },
    publisher: { "@type": "Organization", name: siteConfig.name, url: getSiteUrl() },
    keywords: post.keywords?.length ? post.keywords.join(", ") : undefined,
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="page">
        <header className="article-header">
          <p className="article-eyebrow">{t.essay.eyebrow}</p>
          <h1 className="article-title">{post.title}</h1>
          {post.thesis ? <p className="article-subtitle">{post.thesis}</p> : null}
          <p className="article-meta">
            <time dateTime={post.published_at}>{formatLongDate(post.published_at)}</time>
          </p>
        </header>

        <hr className="article-rule" />

        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

        {newer || older ? (
          <nav className="essay-nav" aria-label={t.essay.adjacent}>
            {newer ? (
              <Link className="essay-nav__item essay-nav__item--newer" href={`/en/essays/${newer.slug}`}>
                <span className="essay-nav__label">{t.essay.newer}</span>
                <span className="essay-nav__title">{newer.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {older ? (
              <Link className="essay-nav__item essay-nav__item--older" href={`/en/essays/${older.slug}`}>
                <span className="essay-nav__label">{t.essay.older}</span>
                <span className="essay-nav__title">{older.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        ) : null}

        <footer className="article-footer">
          <Link href="/en/essays">{t.essay.back}</Link>
          {otherLangs.length ? (
            <span className="article-footer__also">
              {" · "}
              {t.essay.availableIn}
              {": "}
              {otherLangs.map((l, i) => (
                <span key={l}>
                  {i > 0 ? ", " : null}
                  <Link href={l === "zh" ? `/essays/${post.slug}` : `/${l}/essays/${post.slug}`}>
                    {t.switcher.langs[l]}
                  </Link>
                </span>
              ))}
            </span>
          ) : null}
        </footer>
      </article>
    </>
  );
}
