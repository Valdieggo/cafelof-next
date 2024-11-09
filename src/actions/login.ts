"use server"
import * as z from 'zod';
import { LoginSchema } from '../../schemas';

export const login = (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        console.error("Error validating fields: ", validatedFields.error);
        return { error: "Invalid fields" };
    }

    return { success: "Success" };
}