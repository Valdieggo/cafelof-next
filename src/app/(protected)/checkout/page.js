"use client";

import { useState } from "react";
import CheckoutDetails from "@/components/checkout/CheckoutDetails";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import UserInfoForm from "@/components/checkout/UserInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Page() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState("details");
  const [cartIsValid, setCartIsValid] = useState(false); // Validez de los detalles del carrito
  const [userInfoValid, setUserInfoValid] = useState(false); // Validez del formulario de usuario
  const { getTotalPrice } = useCart(); // Total del carrito

  const handleContinue = async () => {
    if (currentStep === "details") {
      setCurrentStep("userInfo");
    } else if (currentStep === "userInfo") {
      if (!userInfoValid) {
        alert("Por favor, completa toda la información requerida antes de continuar.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/transaction/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: getTotalPrice() }),
        });

        const result = await response.json();

        if (response.ok) {
          window.location.href = `${result.url}?token_ws=${result.token}`;
        } else {
          console.error(result.message);
          alert("Error al crear la transacción.");
        }
      } catch (error) {
        console.error("Error interno al crear la transacción:", error);
        alert("Error interno al crear la transacción.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "userInfo") {
      setCurrentStep("details");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to proceed.</div>;
  }

  return (
    <div className="w-full mx-auto mt-8 mb-8 container px-4">
      <Card>
        <CardHeader>
          <CardTitle>Tu carro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {currentStep === "details" && (
                <CheckoutDetails setFormIsValid={setCartIsValid} />
              )}
              {currentStep === "userInfo" && (
                <UserInfoForm
                  onBack={handleBack}
                  onFormValidityChange={setUserInfoValid}
                />
              )}
            </div>
            <CheckoutOrderSummary
              onContinue={handleContinue}
              formIsValid={currentStep === "details" ? cartIsValid : userInfoValid} // Diferenciar validez por fase
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
