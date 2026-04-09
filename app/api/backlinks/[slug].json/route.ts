import { getPostBacklinks } from "@/lib/content";
import { jsonEnvelope, jsonNotFound } from "@/lib/api/response";

type RouteProps = {
  params: Promise<{ slug?: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  if (!slug) {
    return jsonNotFound("backlinks");
  }

  const normalizedSlug = slug.replace(/\.json$/i, "");
  const backlinks = getPostBacklinks(normalizedSlug);

  if (!backlinks) {
    return jsonNotFound("backlinks");
  }

  return jsonEnvelope(backlinks, {
    resource: "backlinks",
    target: normalizedSlug,
    count: backlinks.fromPosts.length + backlinks.fromProjects.length + backlinks.fromTopics.length,
  });
}
