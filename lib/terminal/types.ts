import type { Edge, Now, Post, Profile, Project, Topic } from "@/lib/content/schemas";

export type ParsedCommand =
  | { raw: string; cmd: "help" }
  | { raw: string; cmd: "now" }
  | { raw: string; cmd: "ls"; path: string }
  | { raw: string; cmd: "cat"; path: string }
  | { raw: string; cmd: "find"; query: string }
  | { raw: string; cmd: "graph"; target?: string };

export type TerminalLinkItem = {
  label: string;
  href?: string;
  meta?: string;
  value?: string;
};

export type TerminalSearchSection = {
  label: string;
  items: TerminalLinkItem[];
};

export type TerminalBlock =
  | { type: "text"; lines: string[]; tone?: "default" | "muted" | "error" | "accent" }
  | { type: "bullet_list"; items: string[] }
  | { type: "link_list"; items: TerminalLinkItem[] }
  | { type: "tag_list"; items: Array<{ label: string; href?: string }> }
  | {
      type: "post_list";
      items: Array<{
        slug: string;
        title: string;
        date: string;
        stance: string;
        topics: string[];
        summary?: string;
      }>;
    }
  | {
      type: "topic_list";
      items: Array<{
        slug: string;
        name: string;
        updatedAt: string;
        summary: string;
        relatedTopics: string[];
      }>;
    }
  | {
      type: "project_list";
      items: Array<{
        slug: string;
        name: string;
        status: string;
        summary?: string;
      }>;
    }
  | {
      type: "post_detail";
      post: {
        slug: string;
        title: string;
        publishedAt: string;
        updatedAt: string;
        readingTimeMin: number;
        stance: string;
        thesis: string;
        topics: Array<{ label: string; slug: string }>;
        audience: string[];
        personSnapshot: string[];
      };
    }
  | {
      type: "topic_detail";
      topic: {
        slug: string;
        name: string;
        summary: string;
        updatedAt: string;
        currentPosition: string;
        coreQuestions: string[];
        relatedTopics: string[];
      };
    }
  | {
      type: "project_detail";
      project: {
        slug: string;
        name: string;
        summary: string;
        status: string;
        startedAt: string;
        goals: string[];
        themes: Array<{ label: string; slug: string }>;
      };
    }
  | { type: "markdown"; content: string }
  | {
      type: "relation_list";
      items: Array<{ label: string; value: string; href?: string; meta?: string }>;
    }
  | { type: "search_results"; query: string; sections: TerminalSearchSection[] };

export type ExecutedCommand =
  | { ok: true; command: ParsedCommand; kind: "help"; data: null }
  | { ok: true; command: ParsedCommand; kind: "root_list"; data: { items: TerminalLinkItem[] }; canonicalUrl: "/" }
  | { ok: true; command: ParsedCommand; kind: "profile"; data: Profile; canonicalUrl: "/about" }
  | { ok: true; command: ParsedCommand; kind: "links"; data: Profile["links"]; canonicalUrl: "/" }
  | { ok: true; command: ParsedCommand; kind: "now"; data: Now; canonicalUrl: "/now" }
  | { ok: true; command: ParsedCommand; kind: "post_list"; data: Post[]; canonicalUrl: "/essays" }
  | { ok: true; command: ParsedCommand; kind: "topic_list"; data: Topic[]; canonicalUrl: "/topics" }
  | { ok: true; command: ParsedCommand; kind: "project_list"; data: Project[]; canonicalUrl: "/projects" }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "post";
      data: {
        post: Post;
        relations: Array<{ relation: Post["related_posts"][number]["relation"]; post: Post }>;
      };
      canonicalUrl: string;
    }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "topic";
      data: {
        topic: Topic;
        posts: Post[];
        projects: Project[];
      };
      canonicalUrl: string;
    }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "project";
      data: {
        project: Project;
        relatedPosts: Post[];
      };
      canonicalUrl: string;
    }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "for_agents";
      data: {
        profile: Profile;
        now: Now;
        topics: Topic[];
      };
      canonicalUrl: "/for-agents";
    }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "search";
      data: {
        query: string;
        posts: Post[];
        topics: Topic[];
        projects: Project[];
      };
    }
  | {
      ok: true;
      command: ParsedCommand;
      kind: "graph";
      data: {
        target?: string;
        edges: Edge[];
      };
    }
  | { ok: false; command: ParsedCommand; error: string };

export type RenderedCommandEntry = {
  id: string;
  input: string;
  ok: boolean;
  canonicalUrl?: string;
  blocks: TerminalBlock[];
};
