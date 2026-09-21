import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocalePubliclyEnabled,
  stripLocalePrefix,
  withLocale,
} from "@/lib/i18n";

/**
 * Locale segment is real (`app/[lang]/…`).
 * Bare paths (`/products`) → 308 to `/en/products`.
 * No Accept-Language sniffing — explicit and predictable.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }
    const token = request.cookies.get("tn_cms_auth")?.value;
    if (!token || !token.startsWith("v1.")) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/style-preview")) {
    return NextResponse.next();
  }

  const { locale: pathLocale, pathname: bare } = stripLocalePrefix(pathname);

  if (!pathLocale) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale(pathname === "/" ? "/" : pathname, DEFAULT_LOCALE);
    const res = NextResponse.redirect(url, 308);
    res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  /* Park disabled locales (e.g. FA) onto the default English path. */
  if (!isLocalePubliclyEnabled(pathLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale(bare === "/" ? "/" : bare, DEFAULT_LOCALE);
    const res = NextResponse.redirect(url, 308);
    res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return res;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", pathLocale);
  requestHeaders.set("x-pathname", bare);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  res.cookies.set(LOCALE_COOKIE, pathLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
