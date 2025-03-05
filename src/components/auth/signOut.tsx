"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });

    localStorage.removeItem("user"); 
    sessionStorage.removeItem("user");

    router.push("/");
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut}>Cerrar sesión</Button>
  );
}