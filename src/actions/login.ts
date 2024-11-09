"use server"
import * as z from 'zod';
import { LoginSchema } from '../../schemas';

export const login = (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    console.log("validatedFields: ",validatedFields)
    if (!validatedFields.success) {
        console.error("Error validating fields: ", validatedFields.error);
        return { error: "Invalid fields" };
    }
    console.log("Login successful with values: ", values);
    return { success: "Success" };
}