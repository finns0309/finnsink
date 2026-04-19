import type { MetadataRoute } from "next";

import {
  getAvailableLangs,
  getPosts,
  getProjects,
  getTopics,
} from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getSiteUrl } from "@/lib/site";

function postUrl(siteUrl: string, slug: string, lang: Lang): string {
  return lang === "zh" ? `${siteUrl}/essays/${slug}` : `${siteUrl}/${lang}/essays/${slug}`;
}

function staticUrl(siteUrl: string, path: string, lang: Lang): string {
  if (lang === "zh") return `${siteUrl}${path}`;
  return path ? `${siteUrl}/${lang}${path}` : `${siteUrl}/${lang}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticPaths = ["", "/about", "/now", "/essays", "/topics", "/projects", "/for-agents"];

  // Static routes: zh canonical + en alternate if we serve an /en equivalent.
  // We only ship /en for /, /about, /now, /essays, /for-agents — the rest stay zh-only.
  const enStaticPaths = new Set(["", "/about", "/now", "/essays", "/for-agents"]);

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => {
    const languages: Record<string, string> = { "zh-CN": staticUrl(siteUrl, path, "zh") };
    if (enStaticPaths.has(path)) {
      languages["en"] = staticUrl(siteUrl, path, "en");
    }
    return {
      url: staticUrl(siteUrl, path, "zh"),
      lastModified: new Date(),
      alternates: { languages },
    };
  });

  // Emit one entry per essay per language, each pointing at siblings via hreflang.
  const zhPosts = getPosts("zh");
  const enPosts = getPosts("en");
  const postRoutes: MetadataRoute.Sitemap = [];

  for (const post of zhPosts) {
    const siblings = getAvailableLangs(post.slug);
    const languages: Record<string, string> = {};
    for (const lang of siblings) {
      languages[lang === "zh" ? "zh-CN" : lang] = postUrl(siteUrl, post.slug, lang);
    }
    postRoutes.push({
      url: postUrl(siteUrl, post.slug, "zh"),
      lastModified: new Date(post.updated_at),
      alternates: { languages },
    });
  }

  for (const post of enPosts) {
    const siblings = getAvailableLangs(post.slug);
    const languages: Record<string, string> = {};
    for (const lang of siblings) {
      languages[lang === "zh" ? "zh-CN" : lang] = postUrl(siteUrl, post.slug, lang);
    }
    postRoutes.push({
      url: postUrl(siteUrl, post.slug, "en"),
      lastModified: new Date(post.updated_at),
      alternates: { languages },
    });
  }

  const topicRoutes = getTopics().map((topic) => ({
    url: `${siteUrl}/topics/${topic.slug}`,
    lastModified: new Date(topic.updated_at),
  }));

  const projectRoutes = getProjects().map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(project.started_at),
  }));

  return [...staticRoutes, ...postRoutes, ...topicRoutes, ...projectRoutes];
}
