import { getPostBySlug } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";

type RouteProps = {
  params: Promise<{ slug?: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;

  if (!slug) {
    return jsonNotFound("post");
  }

  const normalizedSlug = slug.replace(/\.json$/i, "");
  const post = getPostBySlug(normalizedSlug);

  if (!post) {
    return jsonNotFound("post");
  }

  return jsonData(post, { resource: "post", target: normalizedSlug });
}
