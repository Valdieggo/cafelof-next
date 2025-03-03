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
import { PasswordChangeSchema } from '../../../schemas';
import { changePassword } from '../../actions/changePassword';

export default function PasswordChangeForm({ token }: { token: string }) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordChangeSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const { password } = values;
        const response = await changePassword({ password, token });
        if (response.success) {
          console.log("1")
          setSuccess(response.success);
        } else {
          console.log("2")
          setError(response.error);
        }
      } catch (error) {
        setError("Ha ocurrido un error al cambiar la contraseña");
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <h1>Cambiar contraseña</h1>
        </CardTitle>
        <CardDescription className="text-center">
          <h2>Ingresa tu nueva contraseña</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      placeholder="Nueva contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      placeholder="Confirmar nueva contraseña"
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
              {isPending ? "Cambiando..." : "Cambiar contraseña"}
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