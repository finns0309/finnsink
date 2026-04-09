import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import {
  edgeSchema,
  nowSchema,
  postSchema,
  profileSchema,
  projectSchema,
  topicSchema,
  type Edge,
  type Now,
  type Post,
  type Profile,
  type Project,
  type Topic,
} from "./schemas";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const STATIC_ROUTES = [
  "/",
  "/about",
  "/now",
  "/essays",
  "/topics",
  "/projects",
  "/for-agents",
] as const;

type ContentStore = {
  profile: Profile;
  now: Now;
  topics: Topic[];
  topicsBySlug: Map<string, Topic>;
  projects: Project[];
  projectsBySlug: Map<string, Project>;
  posts: Post[];
  postsBySlug: Map<string, Post>;
  postsByTopic: Map<string, Post[]>;
  projectsByTopic: Map<string, Project[]>;
  edges: Edge[];
  relatedPostsBySlug: Map<string, Array<{ relation: Post["related_posts"][number]["relation"]; post: Post }>>;
  representativePostsByTopicSlug: Map<string, Post[]>;
  relatedPostsByProjectSlug: Map<string, Post[]>;
};

export type ContentSearchResults = {
  query: string;
  posts: Post[];
  topics: Topic[];
  projects: Project[];
};

export type BacklinkResults = {
  post: Post;
  fromPosts: Array<{
    slug: string;
    title: string;
    relation: Post["related_posts"][number]["relation"];
  }>;
  fromProjects: Project[];
  fromTopics: Topic[];
};

export type ContentValidationIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
  location: string;
};

export type ContentValidationReport = {
  ok: boolean;
  generatedAt: string;
  counts: {
    posts: number;
    topics: number;
    projects: number;
    edges: number;
  };
  issues: ContentValidationIssue[];
};

let cachedStore: ContentStore | null = null;

function readJsonFile<T>(filePath: string, parser: { parse: (input: unknown) => T }): T {
  const raw = fs.readFileSync(filePath, "utf8");
  return parser.parse(JSON.parse(raw));
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function normalizeFrontmatterDates(data: Record<string, unknown>) {
  const nextData = { ...data };

  for (const key of ["published_at", "updated_at"]) {
    const value = nextData[key];

    if (value instanceof Date) {
      nextData[key] = value.toISOString().slice(0, 10);
    }
  }

  return nextData;
}

function readMarkdownFile(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  return postSchema.parse({
    ...normalizeFrontmatterDates(parsed.data),
    content: parsed.content.trim(),
    reading_time_min: estimateReadingTime(parsed.content),
  });
}

function readDirectory<T>(
  directoryPath: string,
  extension: string,
  loader: (filePath: string) => T,
) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(extension))
    .map((fileName) => loader(path.join(directoryPath, fileName)));
}

function sortByDateDescending<T extends { published_at?: string; updated_at?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = new Date(a.published_at ?? a.updated_at ?? 0).getTime();
    const right = new Date(b.published_at ?? b.updated_at ?? 0).getTime();
    return right - left;
  });
}

function buildIndex<T extends { slug: string }>(items: T[], label: string) {
  const index = new Map<string, T>();

  for (const item of items) {
    if (index.has(item.slug)) {
      throw new Error(`Duplicate ${label} slug found: ${item.slug}`);
    }

    index.set(item.slug, item);
  }

  return index;
}

function buildGroupedIndex<T>(items: T[], selector: (item: T) => string[]) {
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    for (const key of selector(item)) {
      const current = grouped.get(key);
      grouped.set(key, current ? [...current, item] : [item]);
    }
  }

  return grouped;
}

function includesQuery(values: Array<string | undefined>, query: string) {
  const lowered = query.toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(lowered));
}

function buildContentStore(): ContentStore {
  const profile = readJsonFile(path.join(CONTENT_ROOT, "profile.json"), profileSchema);
  const now = readJsonFile(path.join(CONTENT_ROOT, "now.json"), nowSchema);
  const topics = readDirectory(path.join(CONTENT_ROOT, "topics"), ".json", (filePath) =>
    readJsonFile(filePath, topicSchema),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const projects = readDirectory(path.join(CONTENT_ROOT, "projects"), ".json", (filePath) =>
    readJsonFile(filePath, projectSchema),
  );
  const posts = sortByDateDescending(
    readDirectory(path.join(CONTENT_ROOT, "posts"), ".md", readMarkdownFile),
  );
  const edges = readJsonFile(path.join(CONTENT_ROOT, "edges.json"), edgeSchema.array());

  const topicsBySlug = buildIndex(topics, "topic");
  const projectsBySlug = buildIndex(projects, "project");
  const postsBySlug = buildIndex(posts, "post");
  const postsByTopic = buildGroupedIndex(posts, (post) => post.topics);
  const projectsByTopic = buildGroupedIndex(projects, (project) => project.themes);

  const relatedPostsBySlug = new Map<
    string,
    Array<{ relation: Post["related_posts"][number]["relation"]; post: Post }>
  >();

  for (const post of posts) {
    const relatedPosts = post.related_posts
      .map((relation) => {
        const related = postsBySlug.get(relation.slug);
        if (!related) {
          return null;
        }

        return {
          relation: relation.relation,
          post: related,
        };
      })
      .filter(Boolean) as Array<{ relation: Post["related_posts"][number]["relation"]; post: Post }>;

    relatedPostsBySlug.set(post.slug, relatedPosts);
  }

  const representativePostsByTopicSlug = new Map<string, Post[]>();
  for (const topic of topics) {
    representativePostsByTopicSlug.set(
      topic.slug,
      topic.representative_posts
        .map((slug) => postsBySlug.get(slug))
        .filter(Boolean) as Post[],
    );
  }

  const relatedPostsByProjectSlug = new Map<string, Post[]>();
  for (const project of projects) {
    relatedPostsByProjectSlug.set(
      project.slug,
      project.related_posts
        .map((slug) => postsBySlug.get(slug))
        .filter(Boolean) as Post[],
    );
  }

  return {
    profile,
    now,
    topics,
    topicsBySlug,
    projects,
    projectsBySlug,
    posts,
    postsBySlug,
    postsByTopic,
    projectsByTopic,
    edges,
    relatedPostsBySlug,
    representativePostsByTopicSlug,
    relatedPostsByProjectSlug,
  };
}

export function getContentStore() {
  if (!cachedStore) {
    cachedStore = buildContentStore();
  }

  return cachedStore;
}

export function clearContentStoreCache() {
  cachedStore = null;
}

export function getProfile(): Profile {
  return getContentStore().profile;
}

export function getNow(): Now {
  return getContentStore().now;
}

export function getTopics(): Topic[] {
  return getContentStore().topics;
}

export function getTopicBySlug(slug: string) {
  return getContentStore().topicsBySlug.get(slug);
}

export function getProjects(): Project[] {
  return getContentStore().projects;
}

export function getProjectBySlug(slug: string) {
  return getContentStore().projectsBySlug.get(slug);
}

export function getPosts(): Post[] {
  return getContentStore().posts;
}

export function getFeaturedPosts() {
  return getPosts().filter((post) => post.featured);
}

export function getPostBySlug(slug: string) {
  return getContentStore().postsBySlug.get(slug);
}

export function getAdjacentPosts(slug: string): { newer: Post | null; older: Post | null } {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { newer: null, older: null };
  }

  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function getPostsByTopic(slug: string) {
  return getContentStore().postsByTopic.get(slug) ?? [];
}

export function getProjectsByTopic(slug: string) {
  return getContentStore().projectsByTopic.get(slug) ?? [];
}

export function getEdges(): Edge[] {
  return getContentStore().edges;
}

export function getRelatedPosts(post: Post) {
  return getContentStore().relatedPostsBySlug.get(post.slug) ?? [];
}

export function getTopicRepresentativePosts(topic: Topic) {
  return getContentStore().representativePostsByTopicSlug.get(topic.slug) ?? [];
}

export function getProjectRelatedPosts(project: Project) {
  return getContentStore().relatedPostsByProjectSlug.get(project.slug) ?? [];
}

export function searchContent(query: string): ContentSearchResults {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      query: "",
      posts: [],
      topics: [],
      projects: [],
    };
  }

  return {
    query: normalizedQuery,
    posts: getPosts().filter((post) =>
      includesQuery(
        [post.title, post.summary, post.thesis, post.content, ...post.topics, ...post.keywords],
        normalizedQuery,
      ),
    ),
    topics: getTopics().filter((topic) =>
      includesQuery(
        [topic.name, topic.summary, topic.current_position, ...topic.core_questions, ...topic.related_topics],
        normalizedQuery,
      ),
    ),
    projects: getProjects().filter((project) =>
      includesQuery([project.name, project.summary, ...project.goals, ...project.themes], normalizedQuery),
    ),
  };
}

export function getGraphEdges(target?: string) {
  const edges = getEdges();

  if (!target) {
    return edges;
  }

  const normalizedTarget = target.replace(/^posts\//, "").replace(/^topics\//, "");
  return edges.filter((edge) => edge.from === normalizedTarget || edge.to === normalizedTarget);
}

export function getPostBacklinks(slug: string): BacklinkResults | null {
  const post = getPostBySlug(slug);

  if (!post) {
    return null;
  }

  const fromPosts = getPosts()
    .flatMap((candidate) =>
      candidate.related_posts
        .filter((relation) => relation.slug === slug)
        .map((relation) => ({
          slug: candidate.slug,
          title: candidate.title,
          relation: relation.relation,
        })),
    )
    .filter((candidate) => candidate.slug !== slug);

  const fromProjects = getProjects().filter((project) => project.related_posts.includes(slug));
  const fromTopics = getTopics().filter((topic) => topic.representative_posts.includes(slug));

  return {
    post,
    fromPosts,
    fromProjects,
    fromTopics,
  };
}

export function validateContent(): ContentValidationReport {
  const store = getContentStore();
  const issues: ContentValidationIssue[] = [];

  const knownTopicSlugs = new Set(store.topics.map((topic) => topic.slug));
  const knownPostSlugs = new Set(store.posts.map((post) => post.slug));
  const knownProjectSlugs = new Set(store.projects.map((project) => project.slug));
  const knownRoutes = new Set<string>([
    ...STATIC_ROUTES,
    ...store.posts.map((post) => `/essays/${post.slug}`),
    ...store.topics.map((topic) => `/topics/${topic.slug}`),
    ...store.projects.map((project) => `/projects/${project.slug}`),
  ]);

  for (const theme of store.profile.themes) {
    if (!knownTopicSlugs.has(theme)) {
      issues.push({
        severity: "warning",
        code: "profile.theme_missing_topic",
        message: `Profile theme "${theme}" does not resolve to a topic page.`,
        location: "content/profile.json",
      });
    }
  }

  for (const route of store.profile.start_here) {
    if (!knownRoutes.has(route)) {
      issues.push({
        severity: "error",
        code: "profile.start_here_missing_route",
        message: `Start route "${route}" does not resolve to a known page.`,
        location: "content/profile.json",
      });
    }
  }

  for (const post of store.posts) {
    for (const topicSlug of post.topics) {
      if (!knownTopicSlugs.has(topicSlug)) {
        issues.push({
          severity: "error",
          code: "post.topic_missing",
          message: `Post "${post.slug}" references missing topic "${topicSlug}".`,
          location: `content/posts/${post.slug}.md`,
        });
      }
    }

    for (const related of post.related_posts) {
      if (!knownPostSlugs.has(related.slug)) {
        issues.push({
          severity: "error",
          code: "post.related_missing",
          message: `Post "${post.slug}" references missing related post "${related.slug}".`,
          location: `content/posts/${post.slug}.md`,
        });
      }
    }
  }

  for (const topic of store.topics) {
    for (const relatedTopic of topic.related_topics) {
      if (!knownTopicSlugs.has(relatedTopic)) {
        issues.push({
          severity: "warning",
          code: "topic.related_topic_missing",
          message: `Topic "${topic.slug}" references missing related topic "${relatedTopic}".`,
          location: `content/topics/${topic.slug}.json`,
        });
      }
    }

    for (const representativePost of topic.representative_posts) {
      if (!knownPostSlugs.has(representativePost)) {
        issues.push({
          severity: "error",
          code: "topic.representative_post_missing",
          message: `Topic "${topic.slug}" references missing representative post "${representativePost}".`,
          location: `content/topics/${topic.slug}.json`,
        });
      }
    }
  }

  for (const project of store.projects) {
    for (const theme of project.themes) {
      if (!knownTopicSlugs.has(theme)) {
        issues.push({
          severity: "error",
          code: "project.theme_missing",
          message: `Project "${project.slug}" references missing theme "${theme}".`,
          location: `content/projects/${project.slug}.json`,
        });
      }
    }

    for (const relatedPost of project.related_posts) {
      if (!knownPostSlugs.has(relatedPost)) {
        issues.push({
          severity: "error",
          code: "project.related_post_missing",
          message: `Project "${project.slug}" references missing post "${relatedPost}".`,
          location: `content/projects/${project.slug}.json`,
        });
      }
    }
  }

  for (const edge of store.edges) {
    const fromKnown = knownPostSlugs.has(edge.from) || knownTopicSlugs.has(edge.from) || knownProjectSlugs.has(edge.from);
    const toKnown = knownPostSlugs.has(edge.to) || knownTopicSlugs.has(edge.to) || knownProjectSlugs.has(edge.to);

    if (!fromKnown || !toKnown) {
      issues.push({
        severity: "warning",
        code: "graph.edge_unknown_node",
        message: `Edge "${edge.from}" -> "${edge.to}" references an unknown node.`,
        location: "content/edges.json",
      });
    }
  }

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    generatedAt: new Date().toISOString(),
    counts: {
      posts: store.posts.length,
      topics: store.topics.length,
      projects: store.projects.length,
      edges: store.edges.length,
    },
    issues,
  };
}
