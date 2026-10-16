import Link from "next/link";
import { notFound } from "next/navigation";

import { EssayRow, ProjectRow } from "@/components/rows";
import { getNow, getPosts, getProjects } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate, localePath } from "@/lib/site";

const RECENT_COUNT = 3;

/** Blank lines in `narrative` separate paragraphs; the home page shows the first. */
export function narrativeParagraphs(narrative: string) {
  return narrative.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/**
 * The hand-written part (narrative + lists) goes stale between updates, so
 * the page also carries two parts derived from content — the latest essays
 * and the projects still marked active — that are fresh on every deploy.
 */
export function NowView({ lang }: { lang: Lang }) {
  const now = getNow(lang);
  if (!now) notFound();
  const t = getMessages(lang);
  const recent = getPosts(lang).slice(0, RECENT_COUNT);
  const active = getProjects(lang).filter((project) => project.status === "active");

  const lists = [
    { key: "working-on", label: t.now.workingOn, items: now.working_on },
    { key: "focus", label: t.now.focus, items: now.focus },
    { key: "reading", label: t.now.reading, items: now.reading },
    { key: "open-loops", label: t.now.openLoops, items: now.open_loops },
  ].filter((list) => list.items.length);

  return (
    <div className="page">
      <h1 className="page-title">{t.now.title}</h1>
      <p className="page-meta meta">
        <span className="spark" aria-hidden="true">✻</span> {t.now.updated}{" "}
        <time dateTime={now.updated_at}>{formatDate(now.updated_at, lang)}</time>
      </p>
      {narrativeParagraphs(now.narrative).map((paragraph) => (
        <p key={paragraph} className="page-lede">{paragraph}</p>
      ))}

      {lists.map((list) => (
        <section key={list.key} className="prose-section" aria-labelledby={`now-${list.key}`}>
          <h2 id={`now-${list.key}`} className="section__label">{list.label}</h2>
          <ul>
            {list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {recent.length ? (
        <section className="section" aria-labelledby="now-recent">
          <div className="section__head">
            <h2 id="now-recent" className="section__label">{t.now.recentWriting}</h2>
            <Link className="section__more" href={localePath(lang, "/essays")}>
              {t.now.all} →
            </Link>
          </div>
          <ul className="rows">
            {recent.map((post) => (
              <EssayRow key={post.slug} post={post} lang={lang} />
            ))}
          </ul>
        </section>
      ) : null}

      {active.length ? (
        <section className="section" aria-labelledby="now-projects">
          <div className="section__head">
            <h2 id="now-projects" className="section__label">{t.now.activeProjects}</h2>
            <Link className="section__more" href={localePath(lang, "/projects")}>
              {t.now.all} →
            </Link>
          </div>
          <ul className="rows rows--spacious">
            {active.map((project) => (
              <ProjectRow key={project.slug} project={project} lang={lang} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
