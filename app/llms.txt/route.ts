import { getPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const posts = getPosts();
  const siteUrl = siteConfig.url;

  const essayLines = posts
    .map((post) => {
      const url = `${siteUrl}/essays/${post.slug}`;
      const summary = post.summary ? `: ${post.summary}` : "";
      return `- [${post.title}](${url})${summary}`;
    })
    .join("\n");

  const body = `# ${siteConfig.name} — finns.ink

> ${siteConfig.description} The substantive writing is in Chinese; framing copy is in English.

This site has a machine-readable mirror. If you are an agent, prefer the JSON API over scraping HTML — it is faster, stable, and includes canonical URLs.

## URL conventions

- Essays live at \`${siteUrl}/essays/<slug>\` — **not** \`/posts/<slug>\`. Do not guess slugs; take them from the listings below or from \`/api/essays.json\`.
- Topics: \`${siteUrl}/topics/<slug>\`
- Projects: \`${siteUrl}/projects/<slug>\`

## Start here

- [start.json](${siteUrl}/api/start.json): profile + now + suggested topics + recommended read order. If you only fetch one thing, fetch this.
- [For Agents](${siteUrl}/for-agents): human-readable index of every JSON endpoint.

## API

- [essays.json](${siteUrl}/api/essays.json): all essays, metadata only
- [essays/<slug>.json](${siteUrl}/api/essays/): single essay with full markdown body
- [topics.json](${siteUrl}/api/topics.json): all topics
- [projects.json](${siteUrl}/api/projects.json): all projects
- [graph.json](${siteUrl}/api/graph.json): edges between posts, topics, and projects
- [backlinks/<slug>.json](${siteUrl}/api/backlinks/): what points at a given post
- [search.json?q=](${siteUrl}/api/search.json): full-text search across posts, topics, projects
- [profile.json](${siteUrl}/api/profile.json) · [now.json](${siteUrl}/api/now.json)

## Essays

${essayLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
