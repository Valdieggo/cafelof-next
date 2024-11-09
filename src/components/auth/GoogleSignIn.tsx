"use client";
import { signIn } from "next-auth/react"; // Import from next-auth/react
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignIn() {
  const handleSignIn = async () => {
    try {
      await signIn("google"); // Client-side sign-in
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <Button onClick={handleSignIn} variant="secondary">
      <FcGoogle />
      Ingresa con Google
    </Button>
  );
}
