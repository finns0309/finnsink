import type { Metadata } from "next";

import { ForAgentsView } from "@/components/views/for-agents";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "For agents",
  alternates: pageAlternates("/for-agents", "zh"),
};

export default function ZhForAgentsPage() {
  return <ForAgentsView lang="zh" />;
}
