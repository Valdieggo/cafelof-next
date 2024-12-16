"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardTitle } from "../ui/card";
import { useEffect, useCallback, useState } from "react";
import { BeatLoader } from "react-spinners";
import FormError from "../ui/form-error";
import FormSuccess from "../ui/form-success";

export default function VerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const fetchToken = async (token: string | null) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verificationToken?token=${token}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data?.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Token no encontrado");
      return;
    }

    const existingToken = await fetchToken(token);
    if (!existingToken) {
      setError("Token inválido");
      return;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      setError("Token expirado");
      return { error: "Token expirado" };
    } else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verificationToken/update?email=${existingToken.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const existingUser = await response.json();
      if (!existingUser) {
        console.log("if ex: ", existingUser)
        return { error: "Correo no encontrado" };
      }
      setSuccess(existingUser.message);
      const deleted = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verificationToken/delete?identifier=${existingToken.identifier}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await deleted.json();
      console.log(data)

    }
  }, [token]);

  useEffect(() => {
    if (token) {
      onSubmit();
    }
  }, [onSubmit, token]);

  return (
    <div className="mx-auto container pt-4">
      <Card className="flex items-center w-full justify-center flex-col">
        <CardTitle className="pt-8">Verificando tu cuenta</CardTitle>
        <div className="flex items-center justify-center pt-8 pb-8">
          {!success && !error &&
            (<BeatLoader color="#000" />)
          }
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      </Card>
    </div>
  );
}
