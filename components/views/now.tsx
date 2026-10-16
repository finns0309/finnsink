import { notFound } from "next/navigation";

import { getNow } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/site";

export function NowView({ lang }: { lang: Lang }) {
  const now = getNow(lang);
  if (!now) notFound();
  const t = getMessages(lang);

  const lists = [
    { key: "focus", label: t.now.focus, items: now.focus },
    { key: "working-on", label: t.now.workingOn, items: now.working_on },
    { key: "open-loops", label: t.now.openLoops, items: now.open_loops },
    { key: "reading", label: t.now.reading, items: now.reading },
  ].filter((list) => list.items.length);

  return (
    <div className="page">
      <h1 className="page-title">{t.now.title}</h1>
      <p className="page-lede">{now.narrative}</p>
      <p className="page-meta meta">
        <span className="spark" aria-hidden="true">✻</span> {t.now.updated}{" "}
        <time dateTime={now.updated_at}>{formatDate(now.updated_at, lang)}</time>
      </p>

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
    </div>
  );
}
