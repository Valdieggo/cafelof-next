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
  secret: process.env.AUTH_SECRET, // This is used globally, including for JWT
  session: {
    strategy: "jwt", // Ensures the JWT strategy is used
  },
  jwt: {}, // No need for a `secret` here; it's handled globally
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // Only secure cookies in production
      },
    },
  },
  debug: true, // Enable debug mode to get better insights into issues
  ...authConfig,
});
