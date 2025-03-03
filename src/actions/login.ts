"use server"
import * as z from 'zod';
import { LoginSchema } from '../../schemas';
import { signIn } from '../../auth';
import { DEFAULT_LOGIN_REDIRECT } from '../../routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/get/${email}`);
  const existingUser = await response.json();

  if (!existingUser || !existingUser.email || !existingUser.user_password) {
    return { error: existingUser.message };
  }

  if(!existingUser.emailVerified){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verificationToken?email=${existingUser.email}`);
    const token = await response.json();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: existingUser.email, token: token.token, type: "verification" }),
      }
    );

    return { success: token.message, flag: true };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "La contraseña no es correcta" };
        case "CallbackRouteError":
          return { error: "Error redirecting" };
        default:
          return { error: "Credenciales incorrectas" };
      }
    }
    throw error;
  }
}
