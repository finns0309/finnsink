import { EssayRow, isThinking } from "@/components/rows";
import { getPosts } from "@/lib/content";
import type { Lang, Post } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/site";

function groupByYear(posts: Post[]): Array<{ year: string; posts: Post[] }> {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.published_at.slice(0, 4);
    const list = groups.get(year);
    if (list) list.push(post);
    else groups.set(year, [post]);
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, items]) => ({ year, posts: items }));
}

/** Renders the ✻ inside a sentence in clay. */
function SparkNote({ text }: { text: string }) {
  const [before, after] = text.split("✻");
  return (
    <p className="page-meta meta">
      {before}
      <span className="spark">✻</span>
      {after}
    </p>
  );
}

/** Every essay, one line each, grouped by year — an index, not a feed. */
export function WritingView({ lang }: { lang: Lang }) {
  const t = getMessages(lang);
  const posts = getPosts(lang);
  const oldest = posts.at(-1);

  return (
    <div className="page">
      <h1 className="page-title">{t.writing.title}</h1>
      {oldest ? (
        <p className="page-lede">
          {t.writing.lede(posts.length, formatDate(oldest.published_at, lang, "month"))}
        </p>
      ) : null}
      {posts.some(isThinking) ? <SparkNote text={t.writing.thinking} /> : null}

      {groupByYear(posts).map((group) => (
        <section key={group.year} className="year-group" aria-labelledby={`year-${group.year}`}>
          <h2 id={`year-${group.year}`} className="section__label year-group__label">
            {group.year}
          </h2>
          <ul className="rows">
            {group.posts.map((post) => (
              <EssayRow key={post.slug} post={post} lang={lang} dateStyle="day" />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
