import Link from "next/link";
import { notFound } from "next/navigation";

import { getProfile } from "@/lib/content";
import { getMessages } from "@/lib/i18n/messages";

export const metadata = {
  title: "About",
};

export default function EnAboutPage() {
  const profile = getProfile("en");
  if (!profile) notFound();
  const t = getMessages("en");

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

      <footer className="article-footer">
        <Link href="/en/for-agents">{t.about.forAgentsLink}</Link>
      </footer>
    </div>
  );
}
