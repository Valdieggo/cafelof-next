import VerificationForm from "@/components/auth/VerificationForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Verificación",
}
export default async function Page({ searchParams }) {

  const token = searchParams.token;
  console.log("token ",searchParams.token);

  if(!token){
    redirect("/login");
  }

  return (
    <VerificationForm />
  );
}