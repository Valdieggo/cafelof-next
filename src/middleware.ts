import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { apiPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, adminRoutePrefix } from "../routes";

export async function middleware(req: any) {
    const { pathname } = req.nextUrl;

    const isApiRoute = pathname.startsWith(apiPrefix);
    const isAuthRoute = authRoutes.includes(pathname);
    const isAdminRoute = pathname.startsWith(adminRoutePrefix);

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    const isLoggedIn = !!token;
    const userRole = token?.role;

    if (isAdminRoute && userRole !== "ADMIN") {
        console.log("Can't access because user is not an admin");
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isApiRoute) {
        console.log("API route");
        return NextResponse.next();
    }

    if (isAuthRoute) {
      console.log("Auth route");
        if (isLoggedIn) {
            console.log("User is logged in");
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
        }else{
          console.log("User is not logged in");
          console.log("token:",token);
          console.log("req: ", req);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};