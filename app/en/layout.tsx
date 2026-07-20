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
  description: getMessages("en").siteDescription,
  openGraph: {
    type: "website",
    locale: OG_LOCALE.en,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/atom+xml": "/en/rss.xml",
    },
  },
};

export const viewport = siteViewport;

export default function EnRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <SiteShell lang="en">{children}</SiteShell>
    </html>
  );
}
