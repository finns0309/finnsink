const DEFAULT_SITE_URL = "https://example.com";

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

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatLongDate(value: string) {
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
