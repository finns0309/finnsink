import { getTopics } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const topics = getTopics();
  return jsonData(topics, { resource: "topics", count: topics.length });
}
