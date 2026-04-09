import { getPosts } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  const posts = getPosts().map(({ content, ...post }) => post);
  return jsonData(posts, { resource: "posts", count: posts.length });
}
