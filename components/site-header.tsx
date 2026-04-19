import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";

type SiteHeaderProps = {
  lang: Lang;
};

function prefix(lang: Lang): string {
  return lang === "zh" ? "" : `/${lang}`;
}

export function SiteHeader({ lang }: SiteHeaderProps) {
  const t = getMessages(lang);
  const base = prefix(lang);
  const navigation = [
    { href: `${base}/essays`, label: t.nav.essays },
    { href: `${base}/now`, label: t.nav.now },
    { href: `${base}/about`, label: t.nav.about },
  ];

  // Only surface langs we actually serve routes for. Re-add "ja" once PR for
  // Japanese content lands; until then linking to /ja would 404.
  const langs: Lang[] = ["zh", "en"];

  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link href={base || "/"} className="site-header__brand">
          finn
        </Link>
        <nav className="site-nav" aria-label="primary">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="site-nav__lang" aria-label={t.switcher.label}>
            {langs.map((l, i) => (
              <span key={l}>
                {i > 0 ? <span aria-hidden="true" className="site-nav__lang-sep">·</span> : null}
                {l === lang ? (
                  <span className="site-nav__lang-current" aria-current="true">
                    {t.switcher.langs[l]}
                  </span>
                ) : (
                  <Link href={l === "zh" ? "/" : `/${l}`}>{t.switcher.langs[l]}</Link>
                )}
              </span>
            ))}
          </span>
        </nav>
      </div>
    </header>
  );
}
