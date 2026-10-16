import type { Metadata } from "next";

import { WritingView } from "@/components/views/writing";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  alternates: pageAlternates("/essays", "en"),
};

export default function EnWritingPage() {
  return <WritingView lang="en" />;
}
