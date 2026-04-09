import { getProjects } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const projects = getProjects();
  return jsonData(projects, { resource: "projects", count: projects.length });
}
