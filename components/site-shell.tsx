import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServedLangs } from "@/lib/content";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";

/**
 * Shared <body> for the per-language root layouts. Language arrives as a
 * static prop from the route tree — never from request headers — so every
 * page stays prerendered.
 */
export function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = getMessages(lang);

  return (
    <body>
      <a className="skip-link" href="#main">
        {t.skipToContent}
      </a>
      <SiteHeader lang={lang} langs={getServedLangs()} />
      <main id="main" className="site-main">
        {children}
      </main>
      <SiteFooter lang={lang} />
      <Analytics />
      <SpeedInsights />
    </body>
  );
}
