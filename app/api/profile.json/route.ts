import { getProfile } from "@/lib/content";
import { jsonData, jsonNotFound } from "@/lib/api/response";
import { langFromRequest } from "@/lib/api/lang";

export function GET(request: Request) {
  const lang = langFromRequest(request);
  const profile = getProfile(lang);
  if (!profile) return jsonNotFound("profile");
  return jsonData(profile, { resource: "profile" });
}
