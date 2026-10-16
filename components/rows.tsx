import Link from "next/link";

import { Phrase } from "@/components/phrase";
import type { Lang, Post, Project } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { formatDate, localePath } from "@/lib/site";

/** Essays still being thought through carry the spark. */
export function isThinking(post: Post) {
  return post.stance === "seed" || post.stance === "working";
}

export function EssayRow({
  post,
  lang,
  dateStyle = "full",
  withSummary = false,
}: {
  post: Post;
  lang: Lang;
  dateStyle?: "full" | "month" | "day";
  withSummary?: boolean;
}) {
  const t = getMessages(lang);

  return (
    <li>
      <Link className="row__link" href={localePath(lang, `/essays/${post.slug}`)}>
        <span>
          <span className="row__title keep-words">
            <Phrase text={post.title} />
          </span>
          {isThinking(post) ? (
            <span className="row__mark spark" title={t.essay.stance[post.stance]}>
              <span aria-hidden="true">✻</span>
              <span className="sr-only">{t.essay.stance[post.stance]}</span>
            </span>
          ) : null}
        </span>
        <time className="row__meta" dateTime={post.published_at}>
          {formatDate(post.published_at, lang, dateStyle)}
        </time>
        {withSummary && post.summary ? <span className="row__desc">{post.summary}</span> : null}
      </Link>
    </li>
  );
}

export function ProjectRow({ project, lang }: { project: Project; lang: Lang }) {
  return (
    <li>
      <Link className="row__link" href={`${localePath(lang, "/projects")}#${project.slug}`}>
        <span>
          <span className="row__title">{project.name}</span>
        </span>
        <span className="row__meta">{project.kind}</span>
        <span className="row__desc">{project.summary}</span>
      </Link>
    </li>
  );
}
