import type { Metadata } from "next";

import { ProjectsView } from "@/components/views/projects";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  alternates: pageAlternates("/projects", "en"),
};

export default function EnProjectsPage() {
  return <ProjectsView lang="en" />;
}
