import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import bcrypt from "bcryptjs"

import type { NextAuthConfig } from "next-auth";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }), 
        Credentials({
        async authorize(credentials){
            const validatedFields = LoginSchema.safeParse(credentials);
            if(validatedFields.success){
                const { email, password } = validatedFields.data;

                const user = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/${email}`).then(res => res.json());

                if(!user || !user.user_password) return null;

                const passwordsMatch = await bcrypt.compare(password, user.user_password);

                if(passwordsMatch) return user;

                return null;
            }
        }
    })],
} satisfies NextAuthConfig;