import { ContactoForm } from "./ContactoForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
  title: "Contacto",
  description: "¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharla.",
}

export default async function Page() {
  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl text-center"><h1>Contáctanos</h1></CardTitle>
          <CardDescription className="text-xl text-center">
            <h2>¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharla</h2>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md mx-auto">
            <ContactoForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

