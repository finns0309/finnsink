import { getNow } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  return jsonData(getNow(), { resource: "now" });
}
