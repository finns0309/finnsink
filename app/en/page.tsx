import type { Metadata } from "next";

import { HomeView } from "@/components/views/home";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  alternates: pageAlternates("/", "en"),
};

export default function EnHomePage() {
  return <HomeView lang="en" />;
}
