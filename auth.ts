import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface User {
    user_role: "USER" | "ADMIN";
  }

  interface Session {
    user: {
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.user_role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as "USER" | "ADMIN",
        };
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use `secure` cookies in production
        path: "/",
        sameSite: "lax",
      },
    },
  },
  ...authConfig,
});
