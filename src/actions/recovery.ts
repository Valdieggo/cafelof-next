"use server";
import * as z from 'zod';
import {PasswordRecoverySchema} from "../../schemas";

export const recovery = async (values: z.infer<typeof PasswordRecoverySchema>) => {
    const validatedEmail = PasswordRecoverySchema.safeParse(values);
    console.log("consolelog ",validatedEmail)
    if (!validatedEmail.success) {
        throw new Error("Invalid email format");
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const request = await fetch(`${baseUrl}/auth/user/get/${validatedEmail.data.email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const user = await request.json();

    if(user.message){
        return {error: "Correo electrónico incorrecto"};
    }else{
        const recoveryTokenFetch = await fetch(`${baseUrl}/auth/recoveryToken?email=${validatedEmail.data.email}`);
        const recoveryToken = await recoveryTokenFetch.json();
        
        if(recoveryToken.error){
            return {error: "Error al generar el token de recuperación"};
        }

        console.log("Recovery token generated successfully for:", validatedEmail.data.email, "with value", recoveryToken.token);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: validatedEmail.data.email, token: recoveryToken.token, type: "recovery" }),
            }
          );

        return {success: "Se ha enviado un enlace de recuperación a tu correo electrónico"};
    }
}