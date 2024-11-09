import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Correo electrónico es requerido"
    }),
    password: z.string().min(1, {
        message: "Contraseña es requerida"
    }),
});


