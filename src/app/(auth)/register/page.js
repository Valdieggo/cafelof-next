import RegisterForm from "@/components/auth/registerForm";
export const metadata = {
  title: "Registro",
  description: "Regístrate para acceder a todas las funcionalidades de la aplicación.",
}

export default function Page() {
    return (
        <div>
            <RegisterForm />
        </div>
    );
}