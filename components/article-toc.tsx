import type { Heading } from "@/lib/content/render";

const MIN_HEADINGS = 3;

export function ArticleToc({ headings, label }: { headings: Heading[]; label: string }) {
  const items = headings.filter((h) => h.depth === 2);
  if (items.length < MIN_HEADINGS) return null;

  return (
    <aside className="article-toc" aria-label={label}>
      <div className="article-toc__inner">
        <p className="article-toc__label">{label}</p>
        <ol className="article-toc__list">
          {items.map((h) => (
            <li key={h.id}>
              <a href={`#${h.id}`}>{h.text}</a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
