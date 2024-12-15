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
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import GoogleSignIn from './GoogleSignIn';
import { useState } from 'react';
import { LoginSchema } from '../../../schemas';
import { login } from '@/actions/login';
import FormError from '../ui/form-error';
import FormSuccess from '../ui/form-success';
import { useTransition } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";


export default function LoginForm() {
  const searchParams = useSearchParams(); // Hook para acceder a los parámetros de la URL
  const router = useRouter(); // Hook para redirigir
  const redirectTo = searchParams.get("redirectTo") || "/profile"; // Obtener `redirectTo`, con `/profile` como fallback

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(async () => {
      const response = await login(values);
      if (response?.error) {
        setError(response.error);
      } else {
        if(response?.flag){
          setSuccess(response?.success);
        }else{
          await getSession();
          router.push(redirectTo); // Redirige después del login exitoso
        }
      }
    });
  };
   

  return (
    <Card className="w-full max-w-md mx-auto mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">Ingresa tus datos para iniciar</CardDescription>
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
                    <Input disabled={isPending} type="email" placeholder="ejemplo@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="********" 
                        {...field} 
                      />
                      <Button
                        disabled={isPending}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <HiEyeSlash className="h-5 w-5 text-gray-500" />
                        ) : (
                          <HiEye className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center flex-col">
        <div className="flex justify-center pb-2">
          <GoogleSignIn />
        </div>
        <div className="flex space-x-2">
          <a href="#" className="text-sm text-blue-600 hover:underline">Recuperar contraseña</a>
          <a href="/register" className="text-sm text-blue-600 hover:underline">Registrarse</a>
        </div>
      </CardFooter>
    </Card>
  );
}
