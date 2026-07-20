import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getMessages(lang);
  const base = lang === "zh" ? "" : `/${lang}`;

  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p>
          {t.footer.tagline} ·{" "}
          <Link href={`${base}/rss.xml`}>rss</Link> ·{" "}
          <Link href={`${base}/for-agents`}>for agents</Link>
        </p>
      </div>
    </footer>
  );
}
