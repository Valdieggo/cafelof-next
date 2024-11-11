import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Correo electrónico es requerido"
    }),
    password: z.string().min(1, {
        message: "Contraseña es requerida"
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Correo electrónico es requerido"
    }),
    password: z.string().min(8, {
        message: "La contraseña debe tener al menos 8 caracteres"
    }),
    name: z.string().min(1, {
        message: "Nombre es requerido"
    }),
    lastname: z.string().min(1, {
        message: "Apellido es requerido"
    }),
});

