import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleToc } from "@/components/article-toc";
import { Phrase } from "@/components/phrase";
import { ReadingProgress } from "@/components/reading-progress";
import { isThinking } from "@/components/rows";
import { getAdjacentPosts, getAvailableLangs, getPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/content/render";
import type { Lang } from "@/lib/content/schemas";
import { LOCALE_TAG, OG_LOCALE, getMessages } from "@/lib/i18n/messages";
import { formatDate, getSiteUrl, localePath, siteConfig } from "@/lib/site";

function essayUrl(lang: Lang, slug: string) {
  return `${getSiteUrl()}${localePath(lang, `/essays/${slug}`)}`;
}

export function essayMetadata(lang: Lang, slug: string): Metadata {
  const post = getPostBySlug(slug, lang);
  if (!post) return {};

  const url = essayUrl(lang, post.slug);
  const languages: Record<string, string> = {};
  for (const sibling of getAvailableLangs(slug)) {
    languages[LOCALE_TAG[sibling]] = essayUrl(sibling, post.slug);
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: url,
      languages,
      types: { "application/atom+xml": localePath(lang, "/rss.xml") },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
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

export function EssayView({ lang, slug }: { lang: Lang; slug: string }) {
  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const t = getMessages(lang);
  const { html, headings } = renderMarkdown(post.content);
  const { newer, older } = getAdjacentPosts(slug, lang);
  const url = essayUrl(lang, post.slug);
  const otherLangs = getAvailableLangs(slug).filter((l) => l !== lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    abstract: post.thesis,
    inLanguage: LOCALE_TAG[lang],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: siteConfig.name, url: getSiteUrl() },
    publisher: { "@type": "Person", name: siteConfig.name, url: getSiteUrl() },
    keywords: post.keywords.length ? post.keywords.join(", ") : undefined,
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
          <h1 className="article-title keep-words">
            <Phrase text={post.title} clauses />
          </h1>
          {post.thesis ? <p className="article-standfirst">{post.thesis}</p> : null}
          <p className="meta dot-list">
            <time dateTime={post.published_at}>{formatDate(post.published_at, lang)}</time>
            <span>{t.essay.readingTime(post.reading_time_min)}</span>
            {post.updated_at > post.published_at ? (
              <span>
                {t.essay.revised} <time dateTime={post.updated_at}>{formatDate(post.updated_at, lang)}</time>
              </span>
            ) : null}
            {isThinking(post) || post.stance === "changed" ? (
              <span className="stance">
                <span className="spark" aria-hidden="true">✻</span>
                {t.essay.stance[post.stance]}
              </span>
            ) : null}
            {otherLangs.length ? (
              <span>
                {t.essay.availableIn}{" "}
                {otherLangs.map((l, i) => (
                  <span key={l}>
                    {i > 0 ? ", " : null}
                    <Link href={localePath(l, `/essays/${post.slug}`)} hrefLang={LOCALE_TAG[l]}>
                      {t.switcher.langs[l]}
                    </Link>
                  </span>
                ))}
              </span>
            ) : null}
          </p>
        </header>

        <hr className="article-rule" />

        <ArticleToc headings={headings} label={t.essay.contents} />

        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

        {post.person_snapshot.length ? (
          <aside className="snapshot" aria-label={t.essay.snapshot}>
            <p className="section__label">{t.essay.snapshot}</p>
            {post.person_snapshot.map((line) => (
              <p key={line} className="snapshot__text">{line}</p>
            ))}
          </aside>
        ) : null}

        {newer || older ? (
          <nav className="essay-nav" aria-label={t.essay.adjacent}>
            {newer ? (
              <Link className="essay-nav__item" href={localePath(lang, `/essays/${newer.slug}`)}>
                <span className="section__label">{t.essay.newer}</span>
                <span className="essay-nav__title keep-words">
                  <Phrase text={newer.title} />
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {older ? (
              <Link
                className="essay-nav__item essay-nav__item--older"
                href={localePath(lang, `/essays/${older.slug}`)}
              >
                <span className="section__label">{t.essay.older}</span>
                <span className="essay-nav__title keep-words">
                  <Phrase text={older.title} />
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        ) : null}

        <p className="back-link">
          <Link href={localePath(lang, "/essays")}>{t.essay.back}</Link>
        </p>
      </article>
    </>
  );
}
