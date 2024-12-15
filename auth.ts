import NextAuth, { type DefaultSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface User {
    user_role: "USER" | "ADMIN"; // Custom user role
  }

  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: "USER" | "ADMIN";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  events: {
    async linkAccount({ user }){
      await prisma.user.update({
        where: { id: user.id },
        data:{ emailVerified: new Date()}
      })
    }
  },
  callbacks: {
    async signIn({ user, account }){
      if(account?.provider !== "credentials") return true;

      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/get/${user.id}`);
      const existingUser = await userResponse.json();

      if(!existingUser.emailVerified) return false;

      return true;
    },
    async jwt({ token, user }) {
      // Add user ID and role to the token if available
      if (user) {
        token.id = user.id;
        token.role = user.user_role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and role to the session object
      if (token.role) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as "USER" | "ADMIN",
        };
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma), // Use PrismaAdapter for user management
  session: { 
    strategy: "jwt", // Ensure JWT is used for session handling
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
  ...authConfig, // Spread in additional configuration
});
