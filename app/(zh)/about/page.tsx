import type { Metadata } from "next";

import { AboutView } from "@/components/views/about";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于",
  alternates: pageAlternates("/about", "zh"),
};

export default function ZhAboutPage() {
  return <AboutView lang="zh" />;
}
