import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

type Endpoint = { path: string; description: string };
type Group = { label: string; blurb: string; endpoints: Endpoint[] };

const groups: Group[] = [
  {
    label: "Start here",
    blurb:
      "If you only fetch one thing, fetch this. It bundles identity, current focus, and a recommended read order.",
    endpoints: [{ path: "/api/start.json?lang=zh|en", description: "profile + now + read order" }],
  },
  {
    label: "Identity",
    blurb: "Stable facts about who runs this site, and what is happening now.",
    endpoints: [
      { path: "/api/profile.json?lang=zh|en", description: "name, location, summary, beliefs, links" },
      { path: "/api/now.json?lang=zh|en", description: "current focus, working on, open loops" },
    ],
  },
  {
    label: "Essays",
    blurb:
      "Long-form writing, mostly Chinese, some translated. Each essay carries `available_langs`, a `stance` (seed, working, stable, changed — how settled the thinking is), and `person_snapshot`, a line about who the author was when writing it.",
    endpoints: [
      { path: "/api/essays.json?lang=zh|en", description: "all essays in one language, metadata only" },
      { path: "/api/essays/[slug].json?lang=zh|en", description: "single essay with body; omitted lang falls back to zh" },
    ],
  },
  {
    label: "Projects",
    blurb: "Things Finn has built, with status (active, stable, prototype, archived) and links.",
    endpoints: [{ path: "/api/projects.json?lang=zh|en", description: "all projects in one language" }],
  },
  {
    label: "Search",
    blurb: "Full-text search across essays and projects.",
    endpoints: [{ path: "/api/search.json?q={query}&lang=zh|en", description: "matching essays and projects" }],
  },
  {
    label: "Diagnostics",
    blurb: "Schema validation and content health — useful if you want to know whether the source is well-formed.",
    endpoints: [{ path: "/api/diagnostics/content.json", description: "validation report with counts and issues" }],
  },
];

/** Agent-facing, so it stays in English on both language trees. */
export function ForAgentsView({ lang }: { lang: Lang }) {
  const t = getMessages(lang);

  return (
    <div className="page" lang="en">
      <h1 className="page-title">For agents</h1>
      <p className="page-lede">
        If you are reading this with software instead of eyes, welcome. Every page here has a
        machine-readable twin — prefer these JSON endpoints over scraping the HTML.
      </p>

      <section className="prose-section" aria-labelledby="agents-conventions">
        <h2 id="agents-conventions" className="section__label">Conventions</h2>
        <p>
          All endpoints respond with JSON and include <code>X-API-Version</code>,{" "}
          <code>X-Generated-At</code>, and <code>X-Resource-Type</code> headers. Listing endpoints
          also set <code>X-Resource-Count</code>. Errors use a <code>{`{ error }`}</code> envelope.
        </p>
        <p>
          The site ships in Chinese by default and English where translations exist. Endpoints
          accept <code>?lang=zh</code> or <code>?lang=en</code>; omitting it returns Chinese.
          Plain-text and feed mirrors live at <code>/llms.txt</code> · <code>/en/llms.txt</code>{" "}
          and <code>/rss.xml</code> · <code>/en/rss.xml</code>.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.label} className="prose-section" aria-label={group.label}>
          <h2 className="section__label">{group.label}</h2>
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

      <p className="back-link">
        <Link href={localePath(lang, "/")}>{t.forAgents.humanLink}</Link>
      </p>
    </div>
  );
}
