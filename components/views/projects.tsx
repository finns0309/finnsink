import Link from "next/link";

import { getPostBySlug, getProjects } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

export function ProjectsView({ lang }: { lang: Lang }) {
  const t = getMessages(lang);
  const projects = getProjects(lang);

  return (
    <div className="page">
      <h1 className="page-title">{t.projects.title}</h1>
      <p className="page-lede">{t.projects.lede}</p>

      <div className="section">
        {projects.map((project) => {
          const links = Object.entries(project.links);
          const related = project.related_essays
            .map((slug) => getPostBySlug(slug, lang))
            .filter((post) => post !== undefined);

          return (
            <article key={project.slug} id={project.slug} className="project">
              <header className="project__head">
                <h2 className="project__name">{project.name}</h2>
                <p className="meta dot-list">
                  <span>{project.kind}</span>
                  <span>{project.year}</span>
                  {project.visibility === "private" ? <span>{t.projects.private}</span> : null}
                  <span>
                    {project.status === "active" ? (
                      <span className="spark" aria-hidden="true">✻ </span>
                    ) : null}
                    {t.projects.status[project.status]}
                  </span>
                </p>
              </header>
              <p className="project__summary">{project.summary}</p>
              {project.description ? <p className="project__desc">{project.description}</p> : null}
              {links.length || related.length ? (
                <p className="project__links dot-list">
                  {links.map(([label, href]) =>
                    href.startsWith("/") ? (
                      <Link key={label} href={href}>{label}</Link>
                    ) : (
                      <a key={label} href={href}>{label} ↗</a>
                    ),
                  )}
                  {related.map((post) => (
                    <Link key={post.slug} href={localePath(lang, `/essays/${post.slug}`)}>
                      {t.projects.related(post.title)}
                    </Link>
                  ))}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
