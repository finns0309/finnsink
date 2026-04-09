import { formatIsoDate, formatRouteLabel, titleCase } from "@/lib/site";
import type { ExecutedCommand, RenderedCommandEntry, TerminalBlock, TerminalLinkItem } from "@/lib/terminal/types";

function makeId(input: string) {
  return `${input}-${Math.random().toString(36).slice(2, 8)}`;
}

function renderHelp(): TerminalBlock[] {
  return [
    {
      type: "text",
      lines: [
        "available commands:",
      ],
      tone: "muted",
    },
    {
      type: "link_list",
      items: [
        { label: "help", meta: "show supported commands" },
        { label: "ls /", meta: "list top-level content nodes" },
        { label: "ls posts/", meta: "list all essays" },
        { label: "cat profile", meta: "show identity and links" },
        { label: "cat posts/<slug>", meta: "open a post" },
        { label: "now", meta: "show current focus" },
        { label: "find <keyword>", meta: "search posts, topics, and projects" },
        { label: "graph <slug>", meta: "show edge relations for a node" },
      ],
    },
  ];
}

function renderLinks(items: Record<string, string> | TerminalLinkItem[]) {
  if (Array.isArray(items)) {
    return [{ type: "link_list", items }] satisfies TerminalBlock[];
  }

  return [
    {
      type: "link_list",
      items: Object.entries(items).map(([label, href]) => ({
        label: formatRouteLabel(label),
        href,
        value: href,
      })),
    },
  ] satisfies TerminalBlock[];
}

export function renderExecutedCommand(executed: ExecutedCommand): RenderedCommandEntry {
  if (!executed.ok) {
    return {
      id: makeId(executed.command.raw || "error"),
      input: executed.command.raw || "help",
      ok: false,
      blocks: [
        {
          type: "text",
          lines: [executed.error],
          tone: "error",
        },
      ],
    };
  }

  let blocks: TerminalBlock[] = [];

  switch (executed.kind) {
    case "help":
      blocks = renderHelp();
      break;
    case "root_list":
      blocks = renderLinks(executed.data.items);
      break;
    case "profile":
      blocks = [
        {
          type: "text",
          lines: [
            executed.data.name,
            `${executed.data.roles.map((role) => titleCase(role)).join(" · ")} · ${executed.data.location}`,
            executed.data.summary,
          ],
        },
        {
          type: "tag_list",
          items: executed.data.themes.map((theme) => ({
            label: titleCase(theme),
            href: `/topics/${theme}`,
          })),
        },
        {
          type: "bullet_list",
          items: executed.data.beliefs,
        },
        ...renderLinks(executed.data.links),
      ];
      break;
    case "links":
      blocks = renderLinks(executed.data);
      break;
    case "now":
      blocks = [
        {
          type: "text",
          lines: [executed.data.narrative, `last updated ${formatIsoDate(executed.data.updated_at)}`],
        },
        { type: "bullet_list", items: executed.data.focus },
        {
          type: "link_list",
          items: executed.data.working_on.map((item) => ({ label: item })),
        },
      ];
      break;
    case "post_list":
      blocks = [
        {
          type: "post_list",
          items: executed.data.map((post) => ({
            slug: post.slug,
            title: post.title,
            date: formatIsoDate(post.published_at),
            stance: post.stance,
            topics: post.topics.map((topic) => titleCase(topic)),
            summary: post.summary,
          })),
        },
      ];
      break;
    case "topic_list":
      blocks = [
        {
          type: "topic_list",
          items: executed.data.map((topic) => ({
            slug: topic.slug,
            name: topic.name,
            updatedAt: formatIsoDate(topic.updated_at),
            summary: topic.summary,
            relatedTopics: topic.related_topics,
          })),
        },
      ];
      break;
    case "project_list":
      blocks = [
        {
          type: "project_list",
          items: executed.data.map((project) => ({
            slug: project.slug,
            name: project.name,
            status: project.status,
            summary: project.summary,
          })),
        },
      ];
      break;
    case "post":
      blocks = [
        {
          type: "post_detail",
          post: {
            slug: executed.data.post.slug,
            title: executed.data.post.title,
            publishedAt: formatIsoDate(executed.data.post.published_at),
            updatedAt: formatIsoDate(executed.data.post.updated_at),
            readingTimeMin: executed.data.post.reading_time_min,
            stance: executed.data.post.stance,
            thesis: executed.data.post.thesis,
            topics: executed.data.post.topics.map((topic) => ({
              label: titleCase(topic),
              slug: topic,
            })),
            audience: executed.data.post.audience,
            personSnapshot: executed.data.post.person_snapshot,
          },
        },
        { type: "markdown", content: executed.data.post.content },
        {
          type: "relation_list",
          items: [
            ...executed.data.relations.map(({ relation, post }) => ({
              label: relation,
              value: post.title,
              href: `/essays/${post.slug}`,
            })),
            ...executed.data.post.disagrees_with.map((item) => ({
              label: "disagrees",
              value: item,
            })),
          ],
        },
      ];
      break;
    case "topic":
      blocks = [
        {
          type: "topic_detail",
          topic: {
            slug: executed.data.topic.slug,
            name: executed.data.topic.name,
            summary: executed.data.topic.summary,
            updatedAt: formatIsoDate(executed.data.topic.updated_at),
            currentPosition: executed.data.topic.current_position,
            coreQuestions: executed.data.topic.core_questions,
            relatedTopics: executed.data.topic.related_topics,
          },
        },
        {
          type: "post_list",
          items: executed.data.posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            date: formatIsoDate(post.published_at),
            stance: post.stance,
            topics: post.topics.map((topic) => titleCase(topic)),
            summary: post.summary,
          })),
        },
        {
          type: "project_list",
          items: executed.data.projects.map((project) => ({
            slug: project.slug,
            name: project.name,
            status: project.status,
            summary: project.summary,
          })),
        },
      ];
      break;
    case "project":
      blocks = [
        {
          type: "project_detail",
          project: {
            slug: executed.data.project.slug,
            name: executed.data.project.name,
            summary: executed.data.project.summary,
            status: executed.data.project.status,
            startedAt: formatIsoDate(executed.data.project.started_at),
            goals: executed.data.project.goals,
            themes: executed.data.project.themes.map((theme) => ({
              label: titleCase(theme),
              slug: theme,
            })),
          },
        },
        {
          type: "post_list",
          items: executed.data.relatedPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            date: formatIsoDate(post.published_at),
            stance: post.stance,
            topics: post.topics.map((topic) => titleCase(topic)),
            summary: post.summary,
          })),
        },
      ];
      break;
    case "for_agents":
      blocks = [
        {
          type: "text",
          lines: [
            "Use this page as onboarding, not as a shortcut.",
            "Stable pages describe durable identity. /now is time-sensitive.",
          ],
        },
        {
          type: "link_list",
          items: executed.data.profile.start_here.map((href) => ({ label: href, href })),
        },
        {
          type: "bullet_list",
          items: executed.data.now.focus,
        },
        {
          type: "tag_list",
          items: executed.data.topics.map((topic) => ({
            label: topic.name,
            href: `/topics/${topic.slug}`,
          })),
        },
      ];
      break;
    case "search":
      blocks = [
        {
          type: "search_results",
          query: executed.data.query,
          sections: [
            {
              label: "posts",
              items: executed.data.posts.map((post) => ({
                label: post.title,
                href: `/essays/${post.slug}`,
                meta: post.summary,
              })),
            },
            {
              label: "topics",
              items: executed.data.topics.map((topic) => ({
                label: topic.name,
                href: `/topics/${topic.slug}`,
                meta: topic.summary,
              })),
            },
            {
              label: "projects",
              items: executed.data.projects.map((project) => ({
                label: project.name,
                href: `/projects/${project.slug}`,
                meta: project.summary,
              })),
            },
          ],
        },
      ];
      break;
    case "graph":
      blocks = [
        {
          type: "relation_list",
          items: executed.data.edges.map((edge) => ({
            label: edge.type,
            value: `${edge.from} -> ${edge.to}`,
            href: edge.to ? `/essays/${edge.to}` : undefined,
          })),
        },
      ];
      break;
  }

  return {
    id: makeId(executed.command.raw || executed.kind),
    input: executed.command.raw || executed.kind,
    ok: true,
    canonicalUrl: "canonicalUrl" in executed ? executed.canonicalUrl : undefined,
    blocks,
  };
}
