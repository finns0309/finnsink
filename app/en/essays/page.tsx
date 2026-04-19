import Link from "next/link";

import { getPosts } from "@/lib/content";
import type { Post } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/site";

export const metadata = {
  title: "Essays",
};

function groupByYear(posts: Post[]): Array<{ year: number; posts: Post[] }> {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = new Date(post.published_at).getFullYear();
    const list = groups.get(year);
    if (list) list.push(post);
    else groups.set(year, [post]);
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, posts: items }));
}

export default function EnEssaysPage() {
  const groups = groupByYear(getPosts("en"));
  const t = getMessages("en");

  return (
    <div className="page">
      <p className="section-label">{t.essays.sectionLabel}</p>

      {groups.map((group) => (
        <section key={group.year} className="essay-year">
          <h2 className="essay-year__label">{group.year}</h2>
          <ul className="entry-list">
            {group.posts.map((post) => (
              <li key={post.slug}>
                <article className="entry">
                  <time className="entry__date" dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                  <h3 className="entry__title">
                    <Link href={`/en/essays/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.summary ? <p className="entry__summary">{post.summary}</p> : null}
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
