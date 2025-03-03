'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from 'react';
import FormError from '../ui/form-error';
import FormSuccess from '../ui/form-success';
import { useTransition } from 'react';
import Link from 'next/link';
import { PasswordRecoverySchema } from '../../../schemas';
import { recovery } from '@/actions/recovery';

export default function PasswordRecoveryForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PasswordRecoverySchema>>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordRecoverySchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await recovery(values);
        if (response.success) {
          setSuccess(response.success);
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError("Ha ocurrido un error al enviar el correo de recuperación");
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <h1>Recuperar contraseña</h1>
        </CardTitle>
        <CardDescription className="text-center">
          <h2>Ingresa tu correo electrónico para recuperar tu contraseña</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isPending} 
                      type="email" 
                      placeholder="ejemplo@mail.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex space-x-4">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}