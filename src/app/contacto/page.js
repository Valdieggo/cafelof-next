import { ContactoForm } from "./ContactoForm";

export default async function Page() {
    return (
        <div>
            <h1>Contacto</h1>
            <p>¡Hola! ¿En qué podemos ayudarte?</p>
            <ContactoForm />
        </div>
    );
  }