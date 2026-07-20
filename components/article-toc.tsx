import type { Heading } from "@/lib/content/render";

const MIN_HEADINGS = 3;

export function ArticleToc({ headings, label }: { headings: Heading[]; label: string }) {
  const items = headings.filter((h) => h.depth === 2);
  if (items.length < MIN_HEADINGS) return null;

  const list = (
    <ol className="article-toc__list">
      {items.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <aside className="article-toc" aria-label={label}>
      {/* Mobile/tablet: native <details>, collapsed by default — no JS. */}
      <details className="article-toc__mobile">
        <summary className="article-toc__label article-toc__summary">{label}</summary>
        {list}
      </details>
      {/* Wide desktop: always-visible sticky sidebar (see globals.css). */}
      <div className="article-toc__inner article-toc__desktop">
        <p className="article-toc__label">{label}</p>
        {list}
      </div>
    </aside>
  );
}
