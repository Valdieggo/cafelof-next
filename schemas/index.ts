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

export const PhoneNumberSchema = z.object({
  phone: z.string().min(1, {
    message: "Número de teléfono es requerido"
  }),
});

export const UserFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  phone: z
    .string()
    .regex(/^\+\([1-9]\d{0,2}\)\d{8,14}$|^\+[1-9]\d{0,2}\d{8,14}$/, "Número de teléfono no válido")
    .min(1, "El teléfono es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
  region: z.string().min(1, "La región es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  email: z.string().email("Correo electrónico no válido"),
});

export const AddressFormSchema = z.object({
  address: z.string().min(1, "La dirección es obligatoria"),
  country: z.string().min(1, "El país es obligatorio"),
  region: z.string().min(1, "La región es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
});

export const GuestUserFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  phone: z
    .string()
    .regex(/^\+\([1-9]\d{0,2}\)\d{8,14}$|^\+[1-9]\d{0,2}\d{8,14}$/, "Número de teléfono no válido")
    .min(1, "El teléfono es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"), // Cambiar a string para el formulario
  email: z.string().email("Correo electrónico no válido"),
});
