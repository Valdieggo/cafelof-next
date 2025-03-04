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

    const data = await response.json();

    if (data.status === 400) {
        return { error: data.message || "Error al crear la cuenta" };
    }

    // Generar un token de verificación
    const verificationTokenFetch = await fetch(`${baseUrl}/auth/verificationToken?email=${values.email}`);
    const verificationToken = await verificationTokenFetch.json();

    if (!verificationToken.token) {
        return { error: "Error al generar el token de verificación" };
    }

    // Enviar el correo de verificación
    const sendEmailResponse = await fetch(`${baseUrl}/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, token: verificationToken.token, type: "verification" }),
    });

    if (!sendEmailResponse.ok) {
        return { error: "Error al enviar el correo de verificación" };
    }

    return { success: verificationToken.message, flag: true };
}