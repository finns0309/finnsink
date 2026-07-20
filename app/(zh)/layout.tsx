import type { ReactNode } from "react";
import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";
import { OG_LOCALE, getMessages } from "@/lib/i18n/messages";
import { getSiteUrl, siteConfig, siteViewport } from "@/lib/site";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: getMessages("zh").siteDescription,
  openGraph: {
    type: "website",
    locale: OG_LOCALE.zh,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/atom+xml": "/rss.xml",
    },
  },
};

export const viewport = siteViewport;

export default function ZhRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <SiteShell lang="zh">{children}</SiteShell>
    </html>
  );
}
