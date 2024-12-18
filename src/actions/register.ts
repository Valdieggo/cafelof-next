"use server"
import * as z from 'zod';
import { RegisterSchema } from '../../schemas';
import bcrypt from 'bcryptjs';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const requestValues = {
        name: values.name + " " + values.lastname,
        email: values.email,
        user_password: values.password,
    };

    requestValues.user_password = await bcrypt.hash(requestValues.user_password, 10);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/auth/user/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestValues),
    });

    const verificationTokenFetch = await fetch(`${baseUrl}/auth/verificationToken?email=${values.email}`);
    const verificationToken = await verificationTokenFetch.json();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, token: verificationToken.token }),
      }
    );

    const data = await response.json();
    
    return data;
}