import { getNow, getProfile, getTopics } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const profile = getProfile();

  return jsonData({
    profile,
    now: getNow(),
    suggested_topics: getTopics().map((topic) => ({
      slug: topic.slug,
      name: topic.name,
      summary: topic.summary,
    })),
    read_order: profile.start_here,
  }, { resource: "start_payload" });
}
