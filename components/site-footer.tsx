import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

const SOURCE_URL = "https://github.com/finns0309/finnsink";

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getMessages(lang);

  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p className="dot-list">
          <span>{t.footer.tagline}</span>
          <Link href={localePath(lang, "/rss.xml")}>RSS</Link>
          <Link href={localePath(lang, "/for-agents")}>For agents</Link>
          <a href={SOURCE_URL}>{t.footer.source}</a>
        </p>
      </div>
    </footer>
  );
}
