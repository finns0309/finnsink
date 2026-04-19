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
import { getMessages } from "@/lib/i18n/messages";
import { formatLongDate, getSiteUrl, siteConfig } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `${getSiteUrl()}/essays/${post.slug}`;

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
      locale: "zh_CN",
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

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = renderMarkdown(post.content);
  const { newer, older } = getAdjacentPosts(slug);
  const url = `${getSiteUrl()}/essays/${post.slug}`;
  const t = getMessages("zh");
  const otherLangs = getAvailableLangs(slug).filter((l) => l !== "zh");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    abstract: post.thesis,
    inLanguage: "zh-CN",
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
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
          <p className="article-eyebrow">essay</p>
          <h1 className="article-title">{post.title}</h1>
          {post.thesis ? <p className="article-subtitle">{post.thesis}</p> : null}
          <p className="article-meta">
            <time dateTime={post.published_at}>{formatLongDate(post.published_at)}</time>
            {otherLangs.length ? (
              <span className="article-meta__also">
                {t.essay.availableIn}{" "}
                {otherLangs.map((l, i) => (
                  <span key={l}>
                    {i > 0 ? ", " : null}
                    <Link href={`/${l}/essays/${post.slug}`}>{t.switcher.langs[l]}</Link>
                  </span>
                ))}
              </span>
            ) : null}
          </p>
        </header>

        <hr className="article-rule" />

        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

        {newer || older ? (
          <nav className="essay-nav" aria-label={t.essay.adjacent}>
            {newer ? (
              <Link className="essay-nav__item essay-nav__item--newer" href={`/essays/${newer.slug}`}>
                <span className="essay-nav__label">← newer</span>
                <span className="essay-nav__title">{newer.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {older ? (
              <Link className="essay-nav__item essay-nav__item--older" href={`/essays/${older.slug}`}>
                <span className="essay-nav__label">older →</span>
                <span className="essay-nav__title">{older.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        ) : null}

        <footer className="article-footer">
          <Link href="/essays">{t.essay.back}</Link>
        </footer>
      </article>
    </>
  );
}
