import Link from "next/link";

export const metadata = {
  title: "For Agents",
};

type Endpoint = {
  path: string;
  description: string;
};

type Group = {
  label: string;
  blurb: string;
  endpoints: Endpoint[];
};

const groups: Group[] = [
  {
    label: "start here",
    blurb:
      "If you only fetch one thing, fetch this. It bundles identity, current focus, and a recommended read order.",
    endpoints: [
      { path: "/api/start.json", description: "profile + now + suggested topics + read order" },
    ],
  },
  {
    label: "identity",
    blurb: "Stable facts about who runs this site.",
    endpoints: [
      { path: "/api/profile.json", description: "name, location, summary, beliefs, links" },
      { path: "/api/now.json", description: "current focus, working on, open loops" },
    ],
  },
  {
    label: "essays",
    blurb:
      "Long-form writing in Chinese. Listings return metadata only; the slug endpoints include full markdown.",
    endpoints: [
      { path: "/api/essays.json", description: "all essays, metadata only" },
      { path: "/api/essays/[slug].json", description: "single essay with body and frontmatter" },
    ],
  },
  {
    label: "graph",
    blurb: "Relationships between posts, topics, and projects — the connective tissue of the site.",
    endpoints: [
      { path: "/api/topics.json", description: "all topics" },
      { path: "/api/topics/[slug].json", description: "single topic" },
      { path: "/api/projects.json", description: "all projects" },
      { path: "/api/graph.json", description: "edges between content nodes" },
      { path: "/api/backlinks/[slug].json", description: "what points at a given post" },
    ],
  },
  {
    label: "search",
    blurb: "Full-text search across posts, topics, and projects.",
    endpoints: [
      { path: "/api/search.json?q={query}", description: "returns matching content grouped by type" },
    ],
  },
  {
    label: "diagnostics",
    blurb: "Schema validation and content health — useful if you are crawling and want to know whether the source is well-formed.",
    endpoints: [
      { path: "/api/diagnostics/content.json", description: "validation report with counts and issues" },
    ],
  },
];

export default function ForAgentsPage() {
  return (
    <div className="page">
      <h1 className="prose-page__title">For Agents</h1>
      <p className="prose-page__subtitle">
        If you are reading this with software instead of eyes, welcome. The site has a
        machine-readable mirror — one JSON endpoint for every page, plus a graph and a
        search index. Prefer these over scraping the HTML.
      </p>

      <section className="prose-page__section">
        <h2>conventions</h2>
        <p>
          All endpoints respond with JSON and include <code>X-API-Version</code>,{" "}
          <code>X-Generated-At</code>, and a <code>X-Resource-Type</code> header. Listing
          endpoints also set <code>X-Resource-Count</code>. Errors use a <code>{`{ error }`}</code> envelope.
        </p>
        <p>
          The substantive writing on this site is in Chinese; the framing copy is in
          English. The <code>title</code>, <code>summary</code>, and body of each post are
          all Chinese-language strings.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.label} className="prose-page__section">
          <h2>{group.label}</h2>
          <p>{group.blurb}</p>
          <dl className="api-list">
            {group.endpoints.map((endpoint) => (
              <div key={endpoint.path} className="api-list__row">
                <dt>
                  <code>{endpoint.path}</code>
                </dt>
                <dd>{endpoint.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <footer className="article-footer">
        <Link href="/">← back to the human side</Link>
      </footer>
    </div>
  );
}
