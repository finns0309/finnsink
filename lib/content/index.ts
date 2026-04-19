import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import {
  DEFAULT_LANG,
  edgeSchema,
  langSchema,
  nowSchema,
  postSchema,
  profileSchema,
  projectSchema,
  topicSchema,
  type Edge,
  type Lang,
  type Now,
  type Post,
  type Profile,
  type Project,
  type Topic,
} from "./schemas";

const LANGS = langSchema.options;

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
  profileByLang: Map<Lang, Profile>;
  now: Now;
  nowByLang: Map<Lang, Now>;
  topics: Topic[];
  topicsBySlug: Map<string, Topic>;
  projects: Project[];
  projectsBySlug: Map<string, Project>;
  posts: Post[];
  postsBySlug: Map<string, Post>;
  postsByLang: Map<Lang, Post[]>;
  postsBySlugAndLang: Map<string, Map<Lang, Post>>;
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
  const profileByLang = new Map<Lang, Profile>();
  const nowByLang = new Map<Lang, Now>();
  for (const lang of LANGS) {
    const profilePath = path.join(CONTENT_ROOT, `profile.${lang}.json`);
    if (fs.existsSync(profilePath)) {
      profileByLang.set(lang, readJsonFile(profilePath, profileSchema));
    }
    const nowPath = path.join(CONTENT_ROOT, `now.${lang}.json`);
    if (fs.existsSync(nowPath)) {
      nowByLang.set(lang, readJsonFile(nowPath, nowSchema));
    }
  }

  const profile = profileByLang.get(DEFAULT_LANG);
  const now = nowByLang.get(DEFAULT_LANG);
  if (!profile) throw new Error(`Missing content/profile.${DEFAULT_LANG}.json`);
  if (!now) throw new Error(`Missing content/now.${DEFAULT_LANG}.json`);
  const topics = readDirectory(path.join(CONTENT_ROOT, "topics"), ".json", (filePath) =>
    readJsonFile(filePath, topicSchema),
  ).sort((a, b) => a.name.localeCompare(b.name));
  const projects = readDirectory(path.join(CONTENT_ROOT, "projects"), ".json", (filePath) =>
    readJsonFile(filePath, projectSchema),
  );
  const posts = sortByDateDescending(
    LANGS.flatMap((lang) =>
      readDirectory(path.join(CONTENT_ROOT, "posts", lang), ".md", (filePath) => {
        const post = readMarkdownFile(filePath);
        if (post.lang !== lang) {
          throw new Error(
            `Post "${post.slug}" has frontmatter lang="${post.lang}" but lives in content/posts/${lang}/. Files must match their directory.`,
          );
        }
        return post;
      }),
    ),
  );
  const edges = readJsonFile(path.join(CONTENT_ROOT, "edges.json"), edgeSchema.array());

  const topicsBySlug = buildIndex(topics, "topic");
  const projectsBySlug = buildIndex(projects, "project");

  // Split posts by language. `postsBySlug` is the default-language (zh) lookup
  // kept for backward compatibility with routes that pre-date i18n.
  // `postsBySlugAndLang` is the authoritative per-language index going forward.
  const postsByLang = new Map<Lang, Post[]>();
  const postsBySlugAndLang = new Map<string, Map<Lang, Post>>();
  for (const post of posts) {
    const inLang = postsByLang.get(post.lang) ?? [];
    inLang.push(post);
    postsByLang.set(post.lang, inLang);

    let bySlug = postsBySlugAndLang.get(post.slug);
    if (!bySlug) {
      bySlug = new Map<Lang, Post>();
      postsBySlugAndLang.set(post.slug, bySlug);
    }
    if (bySlug.has(post.lang)) {
      throw new Error(`Duplicate post slug "${post.slug}" in lang "${post.lang}"`);
    }
    bySlug.set(post.lang, post);
  }

  const postsBySlug = buildIndex(postsByLang.get(DEFAULT_LANG) ?? [], "post");
  const postsByTopic = buildGroupedIndex(postsByLang.get(DEFAULT_LANG) ?? [], (post) => post.topics);
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
    profileByLang,
    now,
    nowByLang,
    topics,
    topicsBySlug,
    projects,
    projectsBySlug,
    posts,
    postsBySlug,
    postsByLang,
    postsBySlugAndLang,
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

export function getProfile(): Profile;
export function getProfile(lang: Lang): Profile | undefined;
export function getProfile(lang: Lang = DEFAULT_LANG): Profile | undefined {
  return getContentStore().profileByLang.get(lang);
}

export function getNow(): Now;
export function getNow(lang: Lang): Now | undefined;
export function getNow(lang: Lang = DEFAULT_LANG): Now | undefined {
  return getContentStore().nowByLang.get(lang);
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

export function getPosts(lang: Lang = DEFAULT_LANG): Post[] {
  return getContentStore().postsByLang.get(lang) ?? [];
}

export function getAllPosts(): Post[] {
  return getContentStore().posts;
}

export function getFeaturedPosts(lang: Lang = DEFAULT_LANG) {
  return getPosts(lang).filter((post) => post.featured);
}

export function getPostBySlug(slug: string, lang: Lang = DEFAULT_LANG) {
  return getContentStore().postsBySlugAndLang.get(slug)?.get(lang);
}

export function getAvailableLangs(slug: string): Lang[] {
  const byLang = getContentStore().postsBySlugAndLang.get(slug);
  return byLang ? Array.from(byLang.keys()) : [];
}

export function getAdjacentPosts(
  slug: string,
  lang: Lang = DEFAULT_LANG,
): { newer: Post | null; older: Post | null } {
  const posts = getPosts(lang);
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
  const defaultLangPosts = store.postsByLang.get(DEFAULT_LANG) ?? [];
  const knownRoutes = new Set<string>([
    ...STATIC_ROUTES,
    ...defaultLangPosts.map((post) => `/essays/${post.slug}`),
    ...store.topics.map((topic) => `/topics/${topic.slug}`),
    ...store.projects.map((project) => `/projects/${project.slug}`),
  ]);

  for (const theme of store.profile.themes) {
    if (!knownTopicSlugs.has(theme)) {
      issues.push({
        severity: "warning",
        code: "profile.theme_missing_topic",
        message: `Profile theme "${theme}" does not resolve to a topic page.`,
        location: "content/profile.zh.json",
      });
    }
  }

  for (const route of store.profile.start_here) {
    if (!knownRoutes.has(route)) {
      issues.push({
        severity: "error",
        code: "profile.start_here_missing_route",
        message: `Start route "${route}" does not resolve to a known page.`,
        location: "content/profile.zh.json",
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
          location: `content/posts/${post.lang}/${post.slug}.md`,
        });
      }
    }

    for (const related of post.related_posts) {
      if (!knownPostSlugs.has(related.slug)) {
        issues.push({
          severity: "error",
          code: "post.related_missing",
          message: `Post "${post.slug}" references missing related post "${related.slug}".`,
          location: `content/posts/${post.lang}/${post.slug}.md`,
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
