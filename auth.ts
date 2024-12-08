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
  // Adapter to connect NextAuth to Prisma and NeonDB
  adapter: PrismaAdapter(prisma),

  // Callbacks to include custom user fields (e.g., role) in the JWT and session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.user_role; // Add the custom user role to the token
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

  // Spread authConfig to reuse provider and other settings
  ...authConfig,

  // If needed, override properties from authConfig here
  secret: process.env.AUTH_SECRET, // Specify secret globally
  session: {
    strategy: "jwt", // Use JWT-based sessions for stateless authentication
  },

  debug: process.env.NODE_ENV === "development", // Enable debug logs only in development
});
