import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        // Fetch user directly from the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.user_password) {
          console.log("User not found or password missing");
          return null;
        }

        // Compare provided password with the hashed password in the database
        const passwordsMatch = await bcrypt.compare(password, user.user_password);
        if (passwordsMatch) {
          console.log("Passwords match");
          return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Allow cookies in a cross-origin context
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: true,
} satisfies NextAuthConfig;
