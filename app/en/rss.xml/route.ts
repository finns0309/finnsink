import { buildAtomFeed } from "@/lib/feeds";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildAtomFeed("en"), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
