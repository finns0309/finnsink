import Link from "next/link";

import { MarkdownContent } from "@/components/markdown-content";
import { StatusBadge } from "@/components/terminal/status-badge";
import { TerminalTag } from "@/components/terminal/terminal-tag";
import type { RenderedCommandEntry, TerminalBlock } from "@/lib/terminal/types";

function renderBlock(block: TerminalBlock, key: string) {
  switch (block.type) {
    case "text":
      return (
        <div key={key} className="space-y-1.5">
          {block.lines.map((line, index) => (
            <p
              key={`${key}-${index}`}
              className={
                block.tone === "error"
                  ? "terminal-error"
                  : block.tone === "accent"
                    ? "terminal-accent"
                    : block.tone === "muted"
                      ? "terminal-subtle"
                      : "terminal-copy text-sm"
              }
            >
              {line}
            </p>
          ))}
        </div>
      );
    case "bullet_list":
      return (
        <ul key={key} className="space-y-2 pl-4 text-sm leading-7 text-[var(--color-text-soft)]">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "link_list":
      return (
        <div key={key} className="space-y-2 text-sm">
          {block.items.map((item) => (
            <p key={`${item.label}-${item.href ?? item.value ?? ""}`}>
              <span className="inline-block min-w-24 text-[var(--color-dim)]">{item.label}</span>
              {item.href ? (
                <Link href={item.href} className="text-[var(--color-accent)] transition hover:text-[var(--color-text)]">
                  {item.value ?? item.href}
                </Link>
              ) : (
                <span className="text-[var(--color-text-soft)]">{item.value ?? item.meta}</span>
              )}
              {item.meta && item.href ? <span className="ml-3 text-[var(--color-dim)]">{item.meta}</span> : null}
            </p>
          ))}
        </div>
      );
    case "tag_list":
      return (
        <div key={key} className="flex flex-wrap gap-3">
          {block.items.map((item) => (
            <TerminalTag key={`${item.label}-${item.href ?? ""}`} label={item.label} href={item.href} />
          ))}
        </div>
      );
    case "post_list":
      return (
        <div key={key}>
          {block.items.map((item) => (
            <article key={item.slug} className="terminal-row">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                <span className="terminal-date">{item.date}</span>
                <Link href={`/essays/${item.slug}`} className="terminal-row-link">
                  {item.title}
                </Link>
              </div>
              <div className="terminal-subrow">
                <StatusBadge value={item.stance} />
                <span className="terminal-subtle">{item.topics.join(", ")}</span>
              </div>
              {item.summary ? <p className="terminal-copy mt-2 text-sm">{item.summary}</p> : null}
            </article>
          ))}
        </div>
      );
    case "topic_list":
      return (
        <div key={key} className="space-y-4">
          {block.items.map((item) => (
            <article key={item.slug} className="space-y-2">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                <span className="terminal-date">{item.updatedAt}</span>
                <Link href={`/topics/${item.slug}`} className="terminal-row-link">
                  {item.name}
                </Link>
              </div>
              <p className="terminal-copy text-sm">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                {item.relatedTopics.map((related) => (
                  <TerminalTag key={`${item.slug}-${related}`} label={related} href={`/topics/${related}`} />
                ))}
              </div>
            </article>
          ))}
        </div>
      );
    case "project_list":
      return (
        <div key={key} className="space-y-3">
          {block.items.map((item) => (
            <div key={item.slug} className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/projects/${item.slug}`} className="terminal-row-link">
                  {item.name}
                </Link>
                <StatusBadge value={item.status} />
              </div>
              {item.summary ? <p className="terminal-copy text-sm">{item.summary}</p> : null}
            </div>
          ))}
        </div>
      );
    case "post_detail":
      return (
        <div key={key} className="space-y-4 border-b border-[var(--color-line-soft)] pb-5">
          <div>
            <h1 className="terminal-title">{block.post.title}</h1>
            <p className="mt-3 text-xs text-[var(--color-dim)]">
              {block.post.publishedAt} · {block.post.readingTimeMin} min · {block.post.stance}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">thesis: {block.post.thesis}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {block.post.topics.map((topic) => (
              <TerminalTag
                key={`${block.post.slug}-${topic.slug}`}
                label={topic.label}
                href={`/topics/${topic.slug}`}
              />
            ))}
          </div>
          <div className="space-y-2 text-sm text-[var(--color-muted)]">
            <p>
              audience: <span className="text-[var(--color-text-soft)]">{block.post.audience.join(", ")}</span>
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span>stance:</span>
              <StatusBadge value={block.post.stance} />
              <span className="text-[var(--color-dim)]">updated {block.post.updatedAt}</span>
            </p>
            <p>
              snapshot: <span className="text-[var(--color-text-soft)]">{block.post.personSnapshot.join(" · ")}</span>
            </p>
          </div>
        </div>
      );
    case "topic_detail":
      return (
        <div key={key} className="space-y-4">
          <div className="space-y-2">
            <h1 className="terminal-title">{block.topic.name}</h1>
            <p className="terminal-copy">{block.topic.summary}</p>
            <p className="text-xs text-[var(--color-dim)]">updated {block.topic.updatedAt}</p>
          </div>
          <p className="terminal-copy">{block.topic.currentPosition}</p>
          <ul className="space-y-2 pl-4 text-sm leading-7 text-[var(--color-text-soft)]">
            {block.topic.coreQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {block.topic.relatedTopics.map((related) => (
              <TerminalTag key={`${block.topic.slug}-${related}`} label={related} href={`/topics/${related}`} />
            ))}
          </div>
        </div>
      );
    case "project_detail":
      return (
        <div key={key} className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="terminal-title">{block.project.name}</h1>
              <StatusBadge value={block.project.status} />
            </div>
            <p className="terminal-copy">{block.project.summary}</p>
            <p className="text-xs text-[var(--color-dim)]">started {block.project.startedAt}</p>
          </div>
          <ul className="space-y-2 pl-4 text-sm leading-7 text-[var(--color-text-soft)]">
            {block.project.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {block.project.themes.map((theme) => (
              <TerminalTag key={`${block.project.slug}-${theme.slug}`} label={theme.label} href={`/topics/${theme.slug}`} />
            ))}
          </div>
        </div>
      );
    case "markdown":
      return <MarkdownContent key={key} content={block.content} />;
    case "relation_list":
      return (
        <div key={key} className="space-y-2 text-sm">
          {block.items.length ? (
            block.items.map((item) => (
              <p key={`${item.label}-${item.value}`}>
                <span className="inline-block min-w-24 text-[var(--color-dim)]">{item.label}</span>
                {item.href ? (
                  <Link href={item.href} className="text-[var(--color-accent)] transition hover:text-[var(--color-text)]">
                    {item.value}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-soft)]">{item.value}</span>
                )}
                {item.meta ? <span className="ml-3 text-[var(--color-dim)]">{item.meta}</span> : null}
              </p>
            ))
          ) : (
            <p className="text-[var(--color-dim)]">none</p>
          )}
        </div>
      );
    case "search_results":
      return (
        <div key={key} className="space-y-4">
          <p className="terminal-subtle">matches for &quot;{block.query}&quot;</p>
          {block.sections.map((section) => (
            <div key={section.label} className="space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-dim)]">{section.label}</p>
              {section.items.length ? (
                <div className="space-y-2 text-sm">
                  {section.items.map((item) => (
                    <p key={`${section.label}-${item.label}`}>
                      {item.href ? (
                        <Link href={item.href} className="text-[var(--color-accent)] transition hover:text-[var(--color-text)]">
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-[var(--color-text)]">{item.label}</span>
                      )}
                      {item.meta ? <span className="ml-3 text-[var(--color-dim)]">{item.meta}</span> : null}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-dim)]">none</p>
              )}
            </div>
          ))}
        </div>
      );
  }
}

export function TerminalEntryView({ entry }: { entry: RenderedCommandEntry }) {
  return (
    <article className="terminal-entry">
      <p className="terminal-command">
        <span className="terminal-prompt">$</span> {entry.input}
      </p>
      <div className="space-y-4">
        {entry.blocks.map((block, index) => renderBlock(block, `${entry.id}-${index}`))}
      </div>
    </article>
  );
}
