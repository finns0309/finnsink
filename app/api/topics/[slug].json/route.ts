import { getPostsByTopic, getProjectsByTopic, getTopicBySlug } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";

type RouteProps = {
  params: Promise<{ slug?: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  if (!slug) {
    return jsonNotFound("topic");
  }

  const normalizedSlug = slug.replace(/\.json$/i, "");
  const topic = getTopicBySlug(normalizedSlug);

  if (!topic) {
    return jsonNotFound("topic");
  }

  return jsonData({
    ...topic,
    posts: getPostsByTopic(normalizedSlug).map(({ content, ...post }) => post),
    projects: getProjectsByTopic(normalizedSlug),
  }, { resource: "topic", target: normalizedSlug });
}
