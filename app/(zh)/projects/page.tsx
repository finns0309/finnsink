import type { Metadata } from "next";

import { ProjectsView } from "@/components/views/projects";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  alternates: pageAlternates("/projects", "zh"),
};

export default function ZhProjectsPage() {
  return <ProjectsView lang="zh" />;
}
