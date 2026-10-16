import type { Viewport } from "next";

import type { Lang } from "@/lib/content/schemas";

const DEFAULT_SITE_URL = "https://example.com";

/** Shared by both root layouts — keeps the browser chrome on the page tint. */
export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#262624" },
  ],
};

function normalizeSiteUrl(value?: string) {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

export function getSiteUrl() {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  );
}

export const siteConfig = {
  name: "Finn",
  description: "Finn's personal site: long-form essays in Chinese, small tools, and what's happening now.",
  url: getSiteUrl(),
};

/** "/essays" → "/essays" for zh, "/en/essays" for en. "/" maps to the language root. */
export function localePath(lang: Lang, path: string) {
  if (lang === "zh") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/**
 * Canonical + hreflang pair for a static page that exists in both languages.
 * `zhPath` is the zh route ("/", "/essays", …); the en twin lives under /en.
 * Relative URLs — resolved against metadataBase by Next.
 */
export function pageAlternates(zhPath: string, lang: Lang) {
  const enPath = zhPath === "/" ? "/en" : `/en${zhPath}`;
  return {
    canonical: lang === "zh" ? zhPath : enPath,
    languages: { "zh-CN": zhPath, en: enPath },
    // Page-level `alternates` replaces the layout's wholesale, so the feed
    // link must ride along here or it disappears from every page.
    types: { "application/atom+xml": lang === "zh" ? "/rss.xml" : "/en/rss.xml" },
  };
}

type DateStyle = "full" | "month" | "day";

/**
 * Content dates are calendar days (YYYY-MM-DD), not instants — format them
 * from their parts so no timezone can shift them by a day.
 *   zh  full "2026 年 10 月 12 日" · month "2026 年 10 月" · day "10 月 12 日"
 *   en  full "October 12, 2026"   · month "October 2026"   · day "Oct 12"
 */
export function formatDate(value: string, lang: Lang = "zh", style: DateStyle = "full") {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return value;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];

  if (lang === "zh" || lang === "ja") {
    const sep = lang === "zh" ? " " : "";
    const parts = {
      full: [`${year}${sep}年`, `${month}${sep}月`, `${day}${sep}日`],
      month: [`${year}${sep}年`, `${month}${sep}月`],
      day: [`${month}${sep}月`, `${day}${sep}日`],
    }[style];
    return parts.join(sep);
  }

  const options: Intl.DateTimeFormatOptions = {
    full: { year: "numeric", month: "long", day: "numeric" } as const,
    month: { year: "numeric", month: "long" } as const,
    day: { month: "short", day: "numeric" } as const,
  }[style];
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function formatIsoDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function sentenceCase(value: string) {
  const normalized = titleCase(value);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatRouteLabel(key: string) {
  return key.replace(/_/g, " ");
}
