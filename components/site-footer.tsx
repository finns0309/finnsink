"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";

function langFromPath(pathname: string): Lang {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  return "zh";
}

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const lang = langFromPath(pathname);
  const t = getMessages(lang);
  const base = lang === "zh" ? "" : `/${lang}`;

  return (
    <footer className="site-footer">
      <div className="page site-footer__inner">
        <p>
          {t.footer.tagline} ·{" "}
          <Link href="/rss.xml">rss</Link> ·{" "}
          <Link href={`${base}/for-agents`}>for agents</Link>
        </p>
      </div>
    </footer>
  );
}
