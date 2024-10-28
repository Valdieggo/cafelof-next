import { ContactoForm } from "./ContactoForm";
import SignIn from "@/components/auth/signIn";

export default async function Page() {
    return (
        <div className="flex flex-col items-center pt-4 min-h-screen">
            <h1 className="text-4xl">Contáctanos</h1>
            <p className="text-xl">¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharla</p>
            <div className="px-10 w-full max-w-md">
                <ContactoForm />
            </div>
            <SignIn />
        </div>
    );
  }