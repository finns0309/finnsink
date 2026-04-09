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

  const topic = getTopicBySlug(slug);

  if (!topic) {
    return jsonNotFound("topic");
  }

  return jsonData({
    ...topic,
    posts: getPostsByTopic(slug).map(({ content, ...post }) => post),
    projects: getProjectsByTopic(slug),
  }, { resource: "topic", target: slug });
}
