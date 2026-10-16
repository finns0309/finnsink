import type { Metadata } from "next";

import { ForAgentsView } from "@/components/views/for-agents";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "For agents",
  alternates: pageAlternates("/for-agents", "en"),
};

export default function EnForAgentsPage() {
  return <ForAgentsView lang="en" />;
}
