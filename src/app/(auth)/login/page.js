import LoginForm from "@/components/auth/loginForm"

export const metadata = {
  title: "Iniciar sesión",
  description: "Inicia sesión con tu cuenta de Google o cuenta personalizada."
}

export default function Page() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}