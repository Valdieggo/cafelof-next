'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import GoogleSignIn from './GoogleSignIn'
import { useState } from 'react'
import { RegisterSchema } from '../../../schemas'
import { register } from '@/actions/register'
import FormError from '../ui/form-error'
import FormSuccess from '../ui/form-success'
import { useTransition } from 'react'

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      lastname: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")
    
    startTransition(() => {
      register(values).then((response) => {
        if(response?.error){
          setError(response?.error)
        }else{
          setSuccess(response?.success)
        }
    })})
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center"><h1>Crea una cuenta</h1></CardTitle>
        <CardDescription className="text-center"><h2>Comienza ingresando tus datos</h2></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Perez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" className="w-full">Crear</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center flex-col">
          <GoogleSignIn />
          <a href="/recovery" className="text-sm text-blue-600 hover:underline">Recuperar contraseña</a>
          <a href="/login" className="text-sm text-blue-600 hover:underline">Ingresar</a>
      </CardFooter>
    </Card>
  )
}
