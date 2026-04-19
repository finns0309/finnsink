import { getAvailableLangs, getPostBySlug } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

type RouteProps = {
  params: Promise<{ slug?: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { slug } = await params;

  if (!slug) {
    return jsonNotFound("essay");
  }

  const normalizedSlug = slug.replace(/\.json$/i, "");
  const lang = langFromRequest(request);
  const post = getPostBySlug(normalizedSlug, lang);

  if (!post) {
    return jsonNotFound("essay");
  }

  return jsonData(
    { ...post, available_langs: getAvailableLangs(normalizedSlug) },
    { resource: "essay", target: normalizedSlug },
  );
}
