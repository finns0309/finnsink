import type { Metadata } from "next";

import { NowView } from "@/components/views/now";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Now",
  alternates: pageAlternates("/now", "en"),
};

export default function EnNowPage() {
  return <NowView lang="en" />;
}
