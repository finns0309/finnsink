import type { Metadata } from "next";

import { AboutView } from "@/components/views/about";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  alternates: pageAlternates("/about", "en"),
};

export default function EnAboutPage() {
  return <AboutView lang="en" />;
}
