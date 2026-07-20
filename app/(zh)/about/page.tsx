import type { Metadata } from "next";
import Link from "next/link";

import { getProfile } from "@/lib/content";
import { getMessages } from "@/lib/i18n/messages";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  alternates: pageAlternates("/about", "zh"),
};

export default function AboutPage() {
  const profile = getProfile();
  const t = getMessages("zh");

  return (
    <div className="page">
      <h1 className="prose-page__title">{profile.name}</h1>
      <p className="prose-page__subtitle">{profile.summary}</p>

      <section className="prose-page__section">
        <p>{profile.long_summary}</p>
      </section>

      {profile.current_work ? (
        <section className="prose-page__section">
          <h2>{t.about.currently}</h2>
          <p>
            {profile.current_work.role} · {profile.current_work.company}
            <br />
            {profile.current_work.focus}
          </p>
        </section>
      ) : null}

      {profile.beliefs.length ? (
        <section className="prose-page__section">
          <h2>{t.about.workingBeliefs}</h2>
          <ul>
            {profile.beliefs.map((belief) => (
              <li key={belief}>{belief}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Object.keys(profile.links).length ? (
        <section className="prose-page__section">
          <h2>{t.about.links}</h2>
          <p>
            {Object.entries(profile.links).map(([label, href], index) => (
              <span key={label}>
                {index > 0 ? " · " : ""}
                <a href={href}>{label}</a>
              </span>
            ))}
          </p>
        </section>
      ) : null}

      <footer className="article-footer">
        <Link href="/for-agents">{t.about.forAgentsLink}</Link>
      </footer>
    </div>
  );
}
