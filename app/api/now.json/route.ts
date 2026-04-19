import { getNow } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const lang = langFromRequest(request);
  const now = getNow(lang);
  if (!now) return jsonNotFound("now");
  return jsonData(now, { resource: "now" });
}
