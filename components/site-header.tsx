import Link from "next/link";

import { NavLink } from "@/components/nav-link";
import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

export function SiteHeader({ lang, langs }: { lang: Lang; langs: Lang[] }) {
  const t = getMessages(lang);

  const navigation = [
    { href: localePath(lang, "/essays"), label: t.nav.writing },
    { href: localePath(lang, "/projects"), label: t.nav.projects },
    { href: localePath(lang, "/now"), label: t.nav.now },
    { href: localePath(lang, "/about"), label: t.nav.about },
  ];

  return (
    <header className="site-header">
      <div className="page site-header__inner">
        <Link href={localePath(lang, "/")} className="site-header__brand">
          finn
        </Link>
        <nav className="site-nav" aria-label="primary">
          {navigation.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
          {langs.length > 1 ? (
            <span className="site-nav__lang" aria-label={t.switcher.label}>
              {langs.map((l, i) => (
                <span key={l}>
                  {i > 0 ? <span aria-hidden="true" className="site-nav__lang-sep">· </span> : null}
                  {l === lang ? (
                    <span className="site-nav__lang-current" aria-current="true">
                      {t.switcher.langs[l]}
                    </span>
                  ) : (
                    <Link href={localePath(l, "/")} hrefLang={l === "zh" ? "zh-CN" : l} lang={l === "zh" ? "zh-CN" : l}>
                      {t.switcher.langs[l]}
                    </Link>
                  )}
                </span>
              ))}
            </span>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
