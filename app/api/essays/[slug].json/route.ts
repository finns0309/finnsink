import { getPostBySlug } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";

type RouteProps = {
  params: Promise<{ slug?: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  if (!slug) {
    return jsonNotFound("essay");
  }

  const normalizedSlug = slug.replace(/\.json$/i, "");
  const post = getPostBySlug(normalizedSlug);

  if (!post) {
    return jsonNotFound("essay");
  }

  return jsonData(post, { resource: "essay", target: normalizedSlug });
}
