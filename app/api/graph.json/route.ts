import { getEdges } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const edges = getEdges();
  return jsonData(edges, { resource: "graph", count: edges.length });
}
