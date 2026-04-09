import {
  getEdges,
  getNow,
  getPostBySlug,
  getProjectBySlug,
  getPosts,
  getPostsByTopic,
  getProfile,
  getProjects,
  getProjectsByTopic,
  getProjectRelatedPosts,
  getGraphEdges,
  getRelatedPosts,
  getTopicBySlug,
  getTopicRepresentativePosts,
  getTopics,
  searchContent,
} from "@/lib/content";
import type { Post, Project, Topic } from "@/lib/content/schemas";
import type { ExecutedCommand, ParsedCommand, TerminalLinkItem } from "@/lib/terminal/types";

function rootItems(): TerminalLinkItem[] {
  return [
    { label: "profile", href: "/about", meta: "identity, beliefs, and links" },
    { label: "now", href: "/now", meta: "current focus and open loops" },
    { label: "posts/", href: "/essays", meta: "all essays" },
    { label: "topics/", href: "/topics", meta: "theme pages" },
    { label: "projects/", href: "/projects", meta: "work in progress" },
    { label: "for-agents", href: "/for-agents", meta: "reading contract" },
  ];
}

function resolveTopicRepresentativePosts(topic: Topic) {
  return getTopicRepresentativePosts(topic);
}

function resolveProjectRelatedPosts(project: Project) {
  return getProjectRelatedPosts(project);
}

export function executeCommand(command: ParsedCommand): ExecutedCommand {
  if (command.cmd === "help") {
    return { ok: true, command, kind: "help", data: null };
  }

  if (command.cmd === "now") {
    return { ok: true, command, kind: "now", data: getNow(), canonicalUrl: "/now" };
  }

  if (command.cmd === "ls") {
    const path = command.path.toLowerCase();

    if (path === "/" || path === "." || path === "root") {
      return {
        ok: true,
        command,
        kind: "root_list",
        data: { items: rootItems() },
        canonicalUrl: "/",
      };
    }

    if (path === "posts") {
      return { ok: true, command, kind: "post_list", data: getPosts(), canonicalUrl: "/essays" };
    }

    if (path === "topics") {
      return { ok: true, command, kind: "topic_list", data: getTopics(), canonicalUrl: "/topics" };
    }

    if (path === "projects") {
      return { ok: true, command, kind: "project_list", data: getProjects(), canonicalUrl: "/projects" };
    }

    return { ok: false, command, error: `Path not found: ${command.path}` };
  }

  if (command.cmd === "cat") {
    const path = command.path.toLowerCase();

    if (path === "profile") {
      return { ok: true, command, kind: "profile", data: getProfile(), canonicalUrl: "/about" };
    }

    if (path === "links") {
      return { ok: true, command, kind: "links", data: getProfile().links, canonicalUrl: "/" };
    }

    if (path === "now") {
      return { ok: true, command, kind: "now", data: getNow(), canonicalUrl: "/now" };
    }

    if (path === "for-agents") {
      return {
        ok: true,
        command,
        kind: "for_agents",
        data: {
          profile: getProfile(),
          now: getNow(),
          topics: getTopics(),
        },
        canonicalUrl: "/for-agents",
      };
    }

    if (path.startsWith("posts/")) {
      const slug = path.slice("posts/".length);
      const post = getPostBySlug(slug);

      if (!post) {
        return { ok: false, command, error: `Post not found: ${slug}` };
      }

      return {
        ok: true,
        command,
        kind: "post",
        data: {
          post,
          relations: getRelatedPosts(post),
        },
        canonicalUrl: `/essays/${post.slug}`,
      };
    }

    if (path.startsWith("topics/")) {
      const slug = path.slice("topics/".length);
      const topic = getTopicBySlug(slug);

      if (!topic) {
        return { ok: false, command, error: `Topic not found: ${slug}` };
      }

      return {
        ok: true,
        command,
        kind: "topic",
        data: {
          topic,
          posts: resolveTopicRepresentativePosts(topic).length
            ? resolveTopicRepresentativePosts(topic)
            : getPostsByTopic(slug),
          projects: getProjectsByTopic(slug),
        },
        canonicalUrl: `/topics/${topic.slug}`,
      };
    }

    if (path.startsWith("projects/")) {
      const slug = path.slice("projects/".length);
      const project = getProjectBySlug(slug);

      if (!project) {
        return { ok: false, command, error: `Project not found: ${slug}` };
      }

      return {
        ok: true,
        command,
        kind: "project",
        data: {
          project,
          relatedPosts: resolveProjectRelatedPosts(project),
        },
        canonicalUrl: `/projects/${project.slug}`,
      };
    }

    return { ok: false, command, error: `Path not found: ${command.path}` };
  }

  if (command.cmd === "find") {
    const query = command.query.trim();

    if (!query) {
      return { ok: false, command, error: "find requires a keyword" };
    }

    const results = searchContent(query);

    return {
      ok: true,
      command,
      kind: "search",
      data: results,
    };
  }

  if (command.cmd === "graph") {
    if (!command.target) {
      return {
        ok: true,
        command,
        kind: "graph",
        data: {
          edges: getEdges(),
        },
      };
    }

    const target = command.target.replace(/^posts\//, "").replace(/^topics\//, "");
    return {
      ok: true,
      command,
      kind: "graph",
      data: {
        target,
        edges: getGraphEdges(target),
      },
    };
  }

  const exhaustiveCheck: never = command;
  throw new Error(`Unsupported command: ${JSON.stringify(exhaustiveCheck)}`);
}
