import { getAvailableLangs, getPosts } from "@/lib/content";
import { jsonData } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const lang = langFromRequest(request);
  const posts = getPosts(lang).map(({ content, ...post }) => ({
    ...post,
    available_langs: getAvailableLangs(post.slug),
  }));
  return jsonData(posts, { resource: "essays", count: posts.length });
}
