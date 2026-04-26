import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import {
  DEFAULT_LANG,
  langSchema,
  nowSchema,
  postSchema,
  profileSchema,
  type Lang,
  type Now,
  type Post,
  type Profile,
} from "./schemas";

const LANGS = langSchema.options;

const CONTENT_ROOT = path.join(process.cwd(), "content");

const STATIC_ROUTES = [
  "/",
  "/about",
  "/now",
  "/essays",
  "/for-agents",
] as const;

type ContentStore = {
  profileByLang: Map<Lang, Profile>;
  nowByLang: Map<Lang, Now>;
  posts: Post[];
  postsByLang: Map<Lang, Post[]>;
  postsBySlugAndLang: Map<string, Map<Lang, Post>>;
};

export type ContentSearchResults = {
  query: string;
  posts: Post[];
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

  if (!profileByLang.has(DEFAULT_LANG)) throw new Error(`Missing content/profile.${DEFAULT_LANG}.json`);
  if (!nowByLang.has(DEFAULT_LANG)) throw new Error(`Missing content/now.${DEFAULT_LANG}.json`);

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

  return {
    profileByLang,
    nowByLang,
    posts,
    postsByLang,
    postsBySlugAndLang,
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

export function getPosts(lang: Lang = DEFAULT_LANG): Post[] {
  return getContentStore().postsByLang.get(lang) ?? [];
}

export function getAllPosts(): Post[] {
  return getContentStore().posts;
}

export function getPostBySlug(slug: string, lang: Lang = DEFAULT_LANG) {
  return getContentStore().postsBySlugAndLang.get(slug)?.get(lang);
}

export function getAvailableLangs(slug: string): Lang[] {
  const byLang = getContentStore().postsBySlugAndLang.get(slug);
  return byLang ? Array.from(byLang.keys()) : [];
}

// Languages we serve site-wide. zh is always included as the canonical default;
// other langs appear once they have at least one post.
export function getServedLangs(): Lang[] {
  const langs = new Set<Lang>([DEFAULT_LANG]);
  for (const lang of getContentStore().postsByLang.keys()) {
    langs.add(lang);
  }
  return LANGS.filter((l) => langs.has(l));
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

export function searchContent(query: string, lang: Lang = DEFAULT_LANG): ContentSearchResults {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return { query: "", posts: [] };
  }

  return {
    query: normalizedQuery,
    posts: getPosts(lang).filter((post) =>
      includesQuery(
        [post.title, post.summary, post.thesis, post.content, ...post.keywords],
        normalizedQuery,
      ),
    ),
  };
}

export function validateContent(): ContentValidationReport {
  const store = getContentStore();
  const issues: ContentValidationIssue[] = [];

  const defaultLangPosts = store.postsByLang.get(DEFAULT_LANG) ?? [];
  const knownRoutes = new Set<string>([
    ...STATIC_ROUTES,
    ...defaultLangPosts.map((post) => `/essays/${post.slug}`),
  ]);

  const profile = store.profileByLang.get(DEFAULT_LANG);
  if (profile) {
    for (const route of profile.start_here) {
      if (!knownRoutes.has(route)) {
        issues.push({
          severity: "error",
          code: "profile.start_here_missing_route",
          message: `Start route "${route}" does not resolve to a known page.`,
          location: "content/profile.zh.json",
        });
      }
    }
  }

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    generatedAt: new Date().toISOString(),
    counts: { posts: store.posts.length },
    issues,
  };
}
