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
        user_firstname: values.name,
        user_lastname: values.lastname,
        user_email: values.email,
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

    const data = await response.json();
    
    return data;
}