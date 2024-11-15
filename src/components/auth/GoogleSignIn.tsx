"use client";
import { signIn } from "next-auth/react"; // Import from next-auth/react
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_ADMIN_LOGIN_REDIRECT } from "../../../routes";

export default function GoogleSignIn() {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: DEFAULT_ADMIN_LOGIN_REDIRECT });
  };

  return (
    <Button onClick={handleSignIn} variant="secondary">
      <FcGoogle />
      Ingresa con Google
    </Button>
  );
}
