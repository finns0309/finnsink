import Link from "next/link";
import { notFound } from "next/navigation";

import { Phrase } from "@/components/phrase";
import { EssayRow, ProjectRow } from "@/components/rows";
import { narrativeParagraphs } from "@/components/views/now";
import { getNow, getPostBySlug, getPosts, getProfile, getProjects } from "@/lib/content";
import type { Lang, Post } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate, getSiteUrl, localePath, siteConfig } from "@/lib/site";

const RECENT_COUNT = 5;
const PROJECT_COUNT = 4;

/**
 * The home page is a calling card, not a feed: who this is, what is
 * happening now, a few things written and made, and where else to look.
 */
export function HomeView({ lang }: { lang: Lang }) {
  const profile = getProfile(lang);
  const now = getNow(lang);
  if (!profile || !now) notFound();

  const t = getMessages(lang);
  const posts = getPosts(lang);
  const recent = posts.slice(0, RECENT_COUNT);
  const recentSlugs = new Set(recent.map((post) => post.slug));
  const startHere = profile.start_here
    .map((route) => /\/essays\/([^/?#]+)$/.exec(route)?.[1])
    .map((slug) => (slug ? getPostBySlug(slug, lang) : undefined))
    .filter((post): post is Post => Boolean(post) && !recentSlugs.has(post!.slug));
  const projects = getProjects(lang).slice(0, PROJECT_COUNT);
  const links = Object.entries(profile.links);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${getSiteUrl()}${localePath(lang, "/")}`,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      description: profile.summary,
      homeLocation: profile.location,
      url: getSiteUrl(),
      sameAs: links.map(([, href]) => href).filter((href) => href.startsWith("https://")),
    },
  };

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero">
        <h1 className="hero__title keep-words">
          <Phrase text={profile.summary} clauses />
        </h1>
        {profile.intro ? <p className="hero__intro">{profile.intro}</p> : null}
      </section>

      <section className="section" aria-labelledby="home-now">
        <div className="section__head">
          <h2 id="home-now" className="section__label">
            <span className="spark" aria-hidden="true">✻</span> {t.home.now}
          </h2>
          <Link className="section__more" href={localePath(lang, "/now")}>
            {t.home.nowMore} →
          </Link>
        </div>
        <p className="now-note">{narrativeParagraphs(now.narrative)[0]}</p>
        <p className="now-note__meta meta">
          {t.now.updated} {formatDate(now.updated_at, lang)}
        </p>
      </section>

      {recent.length ? (
        <section className="section" aria-labelledby="home-writing">
          <div className="section__head">
            <h2 id="home-writing" className="section__label">{t.home.recent}</h2>
            <Link className="section__more" href={localePath(lang, "/essays")}>
              {t.home.allWriting(posts.length)} →
            </Link>
          </div>
          <ul className="rows">
            {recent.map((post) => (
              <EssayRow key={post.slug} post={post} lang={lang} dateStyle="month" />
            ))}
          </ul>
        </section>
      ) : null}

      {startHere.length ? (
        <section className="section" aria-labelledby="home-start">
          <div className="section__head">
            <h2 id="home-start" className="section__label">{t.home.startHere}</h2>
          </div>
          <ul className="rows rows--spacious">
            {startHere.map((post) => (
              <EssayRow key={post.slug} post={post} lang={lang} dateStyle="month" withSummary />
            ))}
          </ul>
        </section>
      ) : null}

      {projects.length ? (
        <section className="section" aria-labelledby="home-projects">
          <div className="section__head">
            <h2 id="home-projects" className="section__label">{t.home.projects}</h2>
            <Link className="section__more" href={localePath(lang, "/projects")}>
              {t.home.allProjects} →
            </Link>
          </div>
          <ul className="rows rows--spacious">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} lang={lang} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section" aria-labelledby="home-elsewhere">
        <div className="section__head">
          <h2 id="home-elsewhere" className="section__label">{t.home.elsewhere}</h2>
        </div>
        <p className="elsewhere dot-list">
          {links.map(([label, href]) => (
            <a key={label} href={href}>
              {href.startsWith("mailto:") ? href.slice("mailto:".length) : label}
            </a>
          ))}
          <Link href={localePath(lang, "/for-agents")}>For agents</Link>
        </p>
      </section>
    </div>
  );
}
