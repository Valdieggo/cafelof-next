import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PhoneNumberSchema } from "../../../../schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";

type PhoneFormProps = {
  userId: number;
  existingPhoneNumber?: string | null;
};

export default function PhoneForm({ userId, existingPhoneNumber }: PhoneFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof PhoneNumberSchema>>({
    resolver: zodResolver(PhoneNumberSchema),
    defaultValues: {
      phone: existingPhoneNumber || "",
    },
  });

  async function onSubmit(values: z.infer<typeof PhoneNumberSchema>) {
    try {
      const response = await fetch("/api/auth/user/phoneNumber/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, phoneNumber: values.phone }),
      });

      if (response.ok) {
        toast.success("Número de teléfono actualizado con éxito", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
        form.reset({ phone: values.phone });
        router.refresh();
      } else {
        toast.error("Error al actualizar número de teléfono", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Ocurrió un error. Por favor, inténtalo de nuevo.", {
        duration: 4000,
        progress: false,
        position: "bottom-center",
        transition: "popUp",
        icon: "",
        sound: false,
      });
    }
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
        <Button type="submit">
          {existingPhoneNumber ? "Actualizar Número" : "Agregar Número"}
        </Button>
      </form>
    </Form>
  );
}