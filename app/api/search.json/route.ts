import { searchContent } from "@/lib/content";
import { jsonBadRequest, jsonEnvelope } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return jsonBadRequest("Missing search query", { resource: "search" });
  }

  const lang = langFromRequest(request);
  const results = searchContent(query, lang);

  return jsonEnvelope(results, {
    resource: "search",
    query,
    count: results.posts.length + results.topics.length + results.projects.length,
  });
}
