import type { Metadata } from "next";

import { HomeView } from "@/components/views/home";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  alternates: pageAlternates("/", "zh"),
};

export default function ZhHomePage() {
  return <HomeView lang="zh" />;
}
