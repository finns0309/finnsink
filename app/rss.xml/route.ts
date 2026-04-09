import { getPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export function GET() {
  const posts = getPosts();
  const updated = posts[0]?.updated_at ?? new Date().toISOString();
  const siteUrl = siteConfig.url;
  const feedUrl = `${siteUrl}/rss.xml`;

  const entries = posts
    .map((post) => {
      const url = `${siteUrl}/essays/${post.slug}`;
      const published = new Date(post.published_at).toISOString();
      const modified = new Date(post.updated_at).toISOString();
      // Summary + thesis as the entry body — not the full essay.
      // Encourages clicking through and keeps the feed light.
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

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN">
  <title>${escapeXml(siteConfig.name)}</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${feedUrl}"/>
  <link rel="alternate" type="text/html" href="${siteUrl}"/>
  <id>${siteUrl}/</id>
  <updated>${new Date(updated).toISOString()}</updated>
  <author><name>${escapeXml(siteConfig.name)}</name></author>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
