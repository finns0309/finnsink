import { DEFAULT_LANG, langSchema, type Lang } from "@/lib/content/schemas";

export function langFromRequest(request: Request): Lang {
  const raw = new URL(request.url).searchParams.get("lang");
  if (!raw) return DEFAULT_LANG;
  const parsed = langSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_LANG;
}
