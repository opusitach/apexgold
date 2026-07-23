import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLang, type Lang } from "./lib/locales";

const COOKIE_KEY = "apexgold-lang";

function preferredLocale(request: NextRequest): Lang {
  // 1) Explicit choice remembered in a cookie (set by the language switcher).
  const cookie = request.cookies.get(COOKIE_KEY)?.value;
  if (cookie && isLang(cookie)) return cookie;

  // 2) Accept-Language header, first matching supported base language.
  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const base = part.trim().split(";")[0].split("-")[0].toLowerCase();
      if (isLang(base)) return base;
    }
  }

  // 3) Default (Czech — primary market).
  return DEFAULT_LOCALE;
}

/**
 * Slugs that were public at some point and no longer exist. They keep a
 * permanent redirect so the link equity and any live inbound links land on the
 * page that replaced them instead of a 404.
 */
const RETIRED_SLUGS: Record<string, string> = {
  "renovace-kamene": "renovace-mramoru",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (hasLocale) {
    const [, locale, slug] = pathname.split("/");
    const replacement = slug ? RETIRED_SLUGS[slug] : undefined;
    if (replacement) {
      request.nextUrl.pathname = `/${locale}/${replacement}`;
      return NextResponse.redirect(request.nextUrl, 308);
    }
    return;
  }

  const locale = preferredLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Run on everything except Next internals, the API, the admin panel, and
  // files with an extension (sitemap.xml, robots.txt, favicon.ico, /images/*).
  // `api` and `admin` are excluded so they are never rewritten into a locale.
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
