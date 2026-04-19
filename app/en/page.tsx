import Link from "next/link";

import { getPosts } from "@/lib/content";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate } from "@/lib/site";

export default function EnHomePage() {
  const posts = getPosts("en");
  const t = getMessages("en");

  return (
    <div className="page">
      <p className="lede">{t.home.lede}</p>

      <ul className="entry-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="entry">
              <time className="entry__date" dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
              <h2 className="entry__title">
                <Link href={`/en/essays/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.summary ? <p className="entry__summary">{post.summary}</p> : null}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
