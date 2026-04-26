import type { MetadataRoute } from "next";

import { getAvailableLangs, getPosts } from "@/lib/content";
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
  const staticPaths = ["", "/about", "/now", "/essays", "/for-agents"];
  // All static routes have an /en mirror.
  const enStaticPaths = new Set(staticPaths);

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

  // Emit one entry per (slug, lang) pair. Each entry shares the same hreflang
  // alternates set, computed once per slug.
  const allPosts = [...getPosts("zh"), ...getPosts("en")];
  const seenSlugs = new Set<string>();
  const postRoutes: MetadataRoute.Sitemap = [];

  for (const post of allPosts) {
    if (seenSlugs.has(`${post.slug}:${post.lang}`)) continue;
    seenSlugs.add(`${post.slug}:${post.lang}`);

    const siblings = getAvailableLangs(post.slug);
    const languages: Record<string, string> = {};
    for (const lang of siblings) {
      languages[lang === "zh" ? "zh-CN" : lang] = postUrl(siteUrl, post.slug, lang);
    }
    postRoutes.push({
      url: postUrl(siteUrl, post.slug, post.lang),
      lastModified: new Date(post.updated_at),
      alternates: { languages },
    });
  }

  return [...staticRoutes, ...postRoutes];
}
