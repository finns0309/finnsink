import { headers } from "next/headers";
import Link from "next/link";

import type { Lang } from "@/lib/content/schemas";
import { getMessages } from "@/lib/i18n/messages";

export const metadata = {
  title: "Not found",
};

export default async function NotFound() {
  const h = await headers();
  const lang = ((h.get("x-lang") as Lang | null) ?? "zh") as Lang;
  const t = getMessages(lang);
  const base = lang === "zh" ? "" : `/${lang}`;

  return (
    <div className="page not-found">
      <p className="not-found__eyebrow">404</p>
      <h1 className="not-found__title">{t.notFound.title}</h1>
      <p className="not-found__body">{t.notFound.body}</p>
      <p className="not-found__actions">
        <Link href={base || "/"}>{t.notFound.home}</Link>
        <span aria-hidden="true">·</span>
        <Link href={`${base}/essays`}>{t.notFound.essays}</Link>
      </p>
    </div>
  );
}
