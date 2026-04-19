import { NextResponse, type NextRequest } from "next/server";

import type { Lang } from "@/lib/content/schemas";

const SUPPORTED: Lang[] = ["zh", "en", "ja"];
const PREF_COOKIE = "preferred_lang";

function langFromPathname(pathname: string): Lang {
  for (const lang of SUPPORTED) {
    if (lang === "zh") continue;
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) return lang;
  }
  return "zh";
}

function preferredLangFromAccept(header: string | null): Lang | null {
  if (!header) return null;
  const tokens = header
    .split(",")
    .map((t) => t.trim().split(";")[0].toLowerCase())
    .filter(Boolean);
  for (const token of tokens) {
    if (token.startsWith("en")) return "en";
    if (token.startsWith("ja")) return "ja";
    if (token.startsWith("zh")) return "zh";
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentLang = langFromPathname(pathname);

  // Root-path-only Accept-Language redirect for first-time visitors.
  // Deeper URLs stay where the sharer put them so external links are stable.
  if (pathname === "/" && !request.cookies.get(PREF_COOKIE)) {
    const preferred = preferredLangFromAccept(request.headers.get("accept-language"));
    if (preferred && preferred !== "zh") {
      const target = request.nextUrl.clone();
      target.pathname = `/${preferred}`;
      return NextResponse.redirect(target);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lang", currentLang);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
