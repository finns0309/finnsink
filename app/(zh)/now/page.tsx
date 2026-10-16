import type { Metadata } from "next";

import { NowView } from "@/components/views/now";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "近况",
  alternates: pageAlternates("/now", "zh"),
};

export default function ZhNowPage() {
  return <NowView lang="zh" />;
}
