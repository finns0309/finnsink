import Link from "next/link";

import { getMessages } from "@/lib/i18n/messages";

export const metadata = {
  title: "For Agents",
};

type Endpoint = { path: string; description: string };
type Group = { label: string; blurb: string; endpoints: Endpoint[] };

const groups: Group[] = [
  {
    label: "start here",
    blurb:
      "If you only fetch one thing, fetch this. It bundles identity, current focus, and a recommended read order.",
    endpoints: [
      { path: "/api/start.json", description: "profile + now + read order" },
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
      "Long-form writing. Posts are bilingual (zh/en) where translations exist. Each response includes `available_langs` so agents can enumerate translations; pass `?lang=zh|en` to select.",
    endpoints: [
      { path: "/api/essays.json?lang=zh|en", description: "all essays in one language, metadata only" },
      { path: "/api/essays/[slug].json?lang=zh|en", description: "single essay with body; omitted lang defaults to zh" },
    ],
  },
  {
    label: "search",
    blurb: "Full-text search across posts.",
    endpoints: [
      { path: "/api/search.json?q={query}", description: "returns posts matching the query" },
    ],
  },
  {
    label: "diagnostics",
    blurb: "Schema validation and content health.",
    endpoints: [
      { path: "/api/diagnostics/content.json", description: "validation report with counts and issues" },
    ],
  },
];

export default function EnForAgentsPage() {
  const t = getMessages("en");
  return (
    <div className="page">
      <h1 className="prose-page__title">For Agents</h1>
      <p className="prose-page__subtitle">
        If you are reading this with software instead of eyes, welcome. The site has a
        machine-readable mirror — one JSON endpoint for every page, plus a search
        index. Prefer these over scraping the HTML.
      </p>

      <section className="prose-page__section">
        <h2>conventions</h2>
        <p>
          All endpoints respond with JSON and include <code>X-API-Version</code>,{" "}
          <code>X-Generated-At</code>, and a <code>X-Resource-Type</code> header. Listing
          endpoints also set <code>X-Resource-Count</code>. Errors use a <code>{`{ error }`}</code> envelope.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.label} className="prose-page__section">
          <h2>{group.label}</h2>
          <p>{group.blurb}</p>
          <dl className="api-list">
            {group.endpoints.map((endpoint) => (
              <div key={endpoint.path} className="api-list__row">
                <dt><code>{endpoint.path}</code></dt>
                <dd>{endpoint.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <footer className="article-footer">
        <Link href="/en">{t.forAgents.humanLink}</Link>
      </footer>
    </div>
  );
}
