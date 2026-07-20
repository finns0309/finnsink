import type { Viewport } from "next";

import type { Lang } from "@/lib/content/schemas";

const DEFAULT_SITE_URL = "https://example.com";

/** Shared by both root layouts — keeps the browser chrome on the paper tint. */
export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1915" },
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
  description: "Notes on attention, knowledge, and tools — written slowly, in Chinese.",
  url: getSiteUrl(),
};

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

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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
