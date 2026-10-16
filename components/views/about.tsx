import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfile } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

const SOURCE_URL = "https://github.com/finns0309/finnsink";

export function AboutView({ lang }: { lang: Lang }) {
  const profile = getProfile(lang);
  if (!profile) notFound();
  const t = getMessages(lang);
  const links = Object.entries(profile.links);

  return (
    <div className="page">
      <h1 className="page-title">{profile.name}</h1>
      <p className="page-lede">{profile.summary}</p>

      <section className="prose-section">
        <p>{profile.long_summary}</p>
      </section>

      {profile.current_work ? (
        <section className="prose-section" aria-labelledby="about-currently">
          <h2 id="about-currently" className="section__label">{t.about.currently}</h2>
          <p>
            {profile.current_work.role} · {profile.current_work.company}
            <br />
            {profile.current_work.focus}
          </p>
        </section>
      ) : null}

      {profile.beliefs.length ? (
        <section className="prose-section" aria-labelledby="about-beliefs">
          <h2 id="about-beliefs" className="section__label">{t.about.beliefs}</h2>
          <ul>
            {profile.beliefs.map((belief) => (
              <li key={belief}>{belief}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {links.length ? (
        <section className="prose-section" aria-labelledby="about-links">
          <h2 id="about-links" className="section__label">{t.about.links}</h2>
          <p className="elsewhere dot-list">
            {links.map(([label, href]) => (
              <a key={label} href={href}>
                {href.startsWith("mailto:") ? href.slice("mailto:".length) : label}
              </a>
            ))}
          </p>
        </section>
      ) : null}

      <section className="prose-section" aria-labelledby="about-colophon">
        <h2 id="about-colophon" className="section__label">{t.about.colophon}</h2>
        <p>{t.about.colophonBody}</p>
        <p className="meta dot-list">
          <a href={SOURCE_URL}>{t.about.source} ↗</a>
          <Link href={localePath(lang, "/for-agents")}>{t.about.forAgentsLink}</Link>
        </p>
      </section>
    </div>
  );
}
