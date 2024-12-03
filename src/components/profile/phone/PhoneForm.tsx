import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PhoneNumberSchema } from "../../../../schemas"
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


type PhoneFormProps = {
  userId: number;
};

export default function PhoneForm({userId}: PhoneFormProps) {
  const form = useForm<z.infer<typeof PhoneNumberSchema>>({
    resolver: zodResolver(PhoneNumberSchema),
    defaultValues: {
      phone: "+569",
    },
  })

  function onSubmit(values: z.infer<typeof PhoneNumberSchema>) {
    fetch("/api/auth/user/phoneNumber/create", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, phoneNumber: values.phone }),
    }).then((response) => {
      if (response.ok) {
        alert("Número de teléfono agregado con éxito");
        form.reset();
      } else {
        alert("Error al agregar número de teléfono");
      }
    });
  }
  

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de teléfono</FormLabel>
            <FormControl>
              <Input placeholder="+56" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Agregar</Button>
      </form>
    </Form>
  )
}