import type { Metadata } from "next";

import { WritingView } from "@/components/views/writing";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "写作",
  alternates: pageAlternates("/essays", "zh"),
};

export default function ZhWritingPage() {
  return <WritingView lang="zh" />;
}
