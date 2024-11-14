import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface User {
    user_email: string;
    user_firstname: string;
    user_lastname: string;
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
        token.email = user.user_email;
        token.name = `${user.user_firstname} ${user.user_lastname}`;
        token.role = user.user_role;
      }
      console.log({ token, user });
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
      console.log({ token, user: session.user });
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: true,
  ...authConfig,
});
