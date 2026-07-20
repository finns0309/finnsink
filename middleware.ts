import { NextResponse, type NextRequest } from "next/server";

const PREF_COOKIE = "preferred_lang";

// Only languages with a served page tree may be redirect targets — `ja` has
// UI messages but no routes, so redirecting there would land on a 404.
type ServedLang = "zh" | "en";

function langFromPathname(pathname: string): ServedLang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

function prefersEnglish(header: string | null): boolean {
  if (!header) return false;
  for (const raw of header.split(",")) {
    const token = raw.trim().split(";")[0]?.toLowerCase();
    if (!token) continue;
    if (token.startsWith("zh")) return false;
    if (token.startsWith("en")) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const currentLang = langFromPathname(pathname);
  const cookieLang = request.cookies.get(PREF_COOKIE)?.value;

  // Root-path-only Accept-Language redirect for first-time visitors.
  // Deeper URLs stay where the sharer put them so external links are stable.
  if (
    pathname === "/" &&
    !cookieLang &&
    prefersEnglish(request.headers.get("accept-language"))
  ) {
    const target = request.nextUrl.clone();
    target.pathname = "/en";
    return NextResponse.redirect(target);
  }

  // No request-header rewriting here: layouts derive language statically from
  // the route tree, which keeps every page prerendered and CDN-served.
  const response = NextResponse.next();

  // Whenever the user is on a given language's URL, record it as their
  // preference. This breaks the Accept-Language auto-redirect loop after the
  // user clicks the switcher — subsequent visits to `/` then respect their choice.
  if (cookieLang !== currentLang) {
    response.cookies.set({
      name: PREF_COOKIE,
      value: currentLang,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
