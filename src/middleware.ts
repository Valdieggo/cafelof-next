import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { apiPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, adminRoutePrefix } from "../routes";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;

  const isApiRoute = pathname.startsWith(apiPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith(adminRoutePrefix);
  const isCookieSecured = process.env.NODE_ENV === "production";

  const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: false });

  const isLoggedIn = !!token;
  const userRole = token?.role;

  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};