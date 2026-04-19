import { getPosts } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { LOCALE_TAG } from "@/lib/i18n/messages";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function postPath(lang: Lang, slug: string): string {
  return lang === "zh" ? `/essays/${slug}` : `/${lang}/essays/${slug}`;
}

function feedPath(lang: Lang): string {
  return lang === "zh" ? "/rss.xml" : `/${lang}/rss.xml`;
}

function sitePath(lang: Lang): string {
  return lang === "zh" ? "/" : `/${lang}`;
}

export function buildAtomFeed(lang: Lang): string {
  const posts = getPosts(lang);
  const updated = posts[0]?.updated_at ?? new Date().toISOString();
  const siteUrl = siteConfig.url;
  const feedUrl = `${siteUrl}${feedPath(lang)}`;

  const entries = posts
    .map((post) => {
      const url = `${siteUrl}${postPath(lang, post.slug)}`;
      const published = new Date(post.published_at).toISOString();
      const modified = new Date(post.updated_at).toISOString();
      const body = [post.thesis, post.summary].filter(Boolean).join("\n\n");

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <id>${url}</id>
    <published>${published}</published>
    <updated>${modified}</updated>
    <summary type="text">${escapeXml(post.summary)}</summary>
    <content type="text">${escapeXml(body)}</content>
    <author><name>${escapeXml(siteConfig.name)}</name></author>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${LOCALE_TAG[lang]}">
  <title>${escapeXml(siteConfig.name)}</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${feedUrl}"/>
  <link rel="alternate" type="text/html" href="${siteUrl}${sitePath(lang)}"/>
  <id>${siteUrl}${sitePath(lang)}</id>
  <updated>${new Date(updated).toISOString()}</updated>
  <author><name>${escapeXml(siteConfig.name)}</name></author>
${entries}
</feed>
`;
}

export function buildLlmsTxt(lang: Lang): string {
  const posts = getPosts(lang);
  const siteUrl = siteConfig.url;

  const essayLines = posts
    .map((post) => {
      const url = `${siteUrl}${postPath(lang, post.slug)}`;
      const summary = post.summary ? `: ${post.summary}` : "";
      return `- [${post.title}](${url})${summary}`;
    })
    .join("\n");

  const description =
    lang === "zh"
      ? `${siteConfig.description} The substantive writing is in Chinese; framing copy is in English.`
      : "Notes on attention, knowledge, and tools — written slowly.";

  const otherLangs: Lang[] = (["zh", "en"] as Lang[]).filter((l) => l !== lang);
  const alternateFeedLine = otherLangs
    .map((l) => `- ${l === "zh" ? "Chinese" : "English"} version: ${siteUrl}${sitePath(l)}`)
    .join("\n");

  return `# ${siteConfig.name} — finns.ink (${LOCALE_TAG[lang]})

> ${description}

This site has a machine-readable mirror. If you are an agent, prefer the JSON API over scraping HTML — it is faster, stable, and includes canonical URLs.

## Other language versions

${alternateFeedLine}

## URL conventions

- Essays: \`${siteUrl}${postPath(lang, "<slug>")}\`
- Topics: \`${siteUrl}/topics/<slug>\`
- Projects: \`${siteUrl}/projects/<slug>\`

## Start here

- [start.json](${siteUrl}/api/start.json?lang=${lang}): profile + now + suggested topics + recommended read order
- [For Agents](${siteUrl}${sitePath(lang)}/for-agents): human-readable index of every JSON endpoint

## API

- [essays.json](${siteUrl}/api/essays.json?lang=${lang}): all ${lang.toUpperCase()} essays, metadata only
- [essays/<slug>.json](${siteUrl}/api/essays/?lang=${lang}): single essay with full markdown body
- [profile.json](${siteUrl}/api/profile.json?lang=${lang}) · [now.json](${siteUrl}/api/now.json?lang=${lang})

## Essays (${lang.toUpperCase()})

${essayLines}
`;
}
