import authConfig from "../auth.config";
import NextAuth from "next-auth";
import { apiPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, adminRoutePrefix } from "../routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith(adminRoutePrefix);

    if(isApiRoute){
        return;
    }

    if(isAuthRoute){
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }else{
            return;
        }
    }

    if(!isLoggedIn && isAdminRoute){
        return Response.redirect(new URL("/login", nextUrl));
    }

    return;
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}