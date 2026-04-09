import { getProfile } from "@/lib/content";
import { jsonData } from "@/lib/api/response";

export function GET() {
  return jsonData(getProfile(), { resource: "profile" });
}
