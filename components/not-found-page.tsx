import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/site";

export function NotFoundPage({ lang }: { lang: Lang }) {
  const t = getMessages(lang);

  return (
    <div className="page not-found">
      <p className="section__label">404</p>
      <h1 className="page-title">{t.notFound.title}</h1>
      <p className="page-lede">{t.notFound.body}</p>
      <p className="not-found__actions meta dot-list">
        <Link href={localePath(lang, "/")}>{t.notFound.home}</Link>
        <Link href={localePath(lang, "/essays")}>{t.notFound.essays}</Link>
      </p>
    </div>
  );
}
