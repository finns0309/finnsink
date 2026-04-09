import Link from "next/link";

import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/site";

export default function HomePage() {
  const posts = getPosts();

  return (
    <div className="page">
      <p className="lede">
        Notes on attention, knowledge, and tools — written slowly, in Chinese.
        Long-form essays, published when they are ready.
      </p>

      <ul className="entry-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="entry">
              <time className="entry__date" dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
              <h2 className="entry__title">
                <Link href={`/essays/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.summary ? <p className="entry__summary">{post.summary}</p> : null}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
