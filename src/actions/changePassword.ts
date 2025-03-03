"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

export async function changePassword({ password, token }: { password: string, token: string }) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const request = await fetch(`${baseUrl}/auth/recoveryToken?token=${token}`);
    const existingToken = await request.json();

    if(existingToken.token === null){
        return { error: "Token invalido"}
    }


    const email = existingToken.token.email;

    const existingUser = await fetch(`${baseUrl}/auth/user/get/${email}`).then(res => res.json());

    const hasExpired = existingToken.token.expires < new Date();

    if (hasExpired) {
        return { error: "Token expirado" }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                user_password: hashedPassword
            }
        })

        await prisma.recoveryToken.delete({
            where: {
                identifier: existingToken.token.identifier
            }
        })
    }catch(e){
        console.log(e);
        return { error: "Error al cambiar la contraseña"}
    }

    return { success: "Contraseña cambiada exitosamente"}
}