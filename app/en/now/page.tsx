import { notFound } from "next/navigation";

import { getNow } from "@/lib/content";
import { getMessages } from "@/lib/i18n/messages";
import { formatLongDate } from "@/lib/site";

export const metadata = {
  title: "Now",
};

export default function EnNowPage() {
  const now = getNow("en");
  if (!now) notFound();
  const t = getMessages("en");

  return (
    <div className="page">
      <h1 className="prose-page__title">{t.now.title}</h1>
      <p className="prose-page__meta">{t.now.updated} {formatLongDate(now.updated_at)}</p>

      <section className="prose-page__section">
        <p>{now.narrative}</p>
      </section>

      {now.focus.length ? (
        <section className="prose-page__section">
          <h2>{t.now.focus}</h2>
          <ul>{now.focus.map((item) => (<li key={item}>{item}</li>))}</ul>
        </section>
      ) : null}

      {now.working_on.length ? (
        <section className="prose-page__section">
          <h2>{t.now.workingOn}</h2>
          <ul>{now.working_on.map((item) => (<li key={item}>{item}</li>))}</ul>
        </section>
      ) : null}

      {now.open_loops.length ? (
        <section className="prose-page__section">
          <h2>{t.now.openLoops}</h2>
          <ul>{now.open_loops.map((item) => (<li key={item}>{item}</li>))}</ul>
        </section>
      ) : null}

      {now.reading.length ? (
        <section className="prose-page__section">
          <h2>{t.now.reading}</h2>
          <ul>{now.reading.map((item) => (<li key={item}>{item}</li>))}</ul>
        </section>
      ) : null}
    </div>
  );
}
