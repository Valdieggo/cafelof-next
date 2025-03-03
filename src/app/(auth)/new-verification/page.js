import VerificationForm from "@/components/auth/VerificationForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Verificación",
}
export default async function Page({params}) {

  const token = params.token;
  console.log("token ",params.token);

  if(!token){
    redirect("/login");
  }

  return (
    <VerificationForm />
  );
}