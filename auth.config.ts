import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    // Google OAuth provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // Credentials provider
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate incoming credentials using LoginSchema
          const validatedFields = LoginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.error("Validation failed:", validatedFields.error);
            return null;
          }

          const { email, password } = validatedFields.data;

          // Fetch user data from your API
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/get/${email}`);
          if (!userResponse.ok) {
            console.error("Failed to fetch user data");
            return null;
          }

          const user = await userResponse.json();

          // Check if the user exists and has a password
          if (!user || !user.user_password) {
            console.error("User not found or password missing");
            return null;
          }

          // Compare provided password with hashed password in the database
          const passwordsMatch = await bcrypt.compare(password, user.user_password);
          if (!passwordsMatch) {
            console.error("Invalid password");
            return null;
          }

          // Return the user object with all required properties
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            user_role: user.user_role, // Ensure the role is mapped correctly
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development", // Debugging enabled only in development mode
} satisfies NextAuthConfig;
