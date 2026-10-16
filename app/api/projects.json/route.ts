import { getProjects } from "@/lib/content";
import { jsonData } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const lang = langFromRequest(request);
  const projects = getProjects(lang);
  return jsonData(projects, { resource: "projects", count: projects.length });
}
