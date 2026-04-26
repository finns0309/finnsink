import { getNow, getProfile } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const lang = langFromRequest(request);
  const profile = getProfile(lang);
  const now = getNow(lang);
  if (!profile || !now) return jsonNotFound("start_payload");

  return jsonData({
    lang,
    profile,
    now,
    read_order: profile.start_here,
  }, { resource: "start_payload" });
}
