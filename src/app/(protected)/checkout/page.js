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
        // Crear orden en la base de datos
        const createOrderResponse = await fetch("/api/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id, // ID del usuario autenticado
            totalAmount: getTotalPrice(),
            buyOrder: session.user.id,
          }),
        });
  
        const createdOrder = await createOrderResponse.json();
  
        if (!createOrderResponse.ok) {
          throw new Error('Error al crear la orden');
        }
  
        // Crear transacción en Webpay usando el order_id como buyOrder y session.user.id como sessionId
        const transactionResponse = await fetch("/api/transaction/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: createdOrder.order_id, // Utilizar el order_id generado
            sessionId: session.user.id, // ID de sesión de NextAuth
            amount: createdOrder.order_total_price,
          }),
        });
  
        const transaction = await transactionResponse.json();
  
        if (!transactionResponse.ok) {
          throw new Error('Error al crear la transacción en Webpay');
        }
  
        // Redirigir al flujo de pago
        window.location.href = `${transaction.url}?token_ws=${transaction.token}`;
      } catch (error) {
        console.error("Error al continuar:", error);
        alert("Hubo un problema al procesar tu solicitud.");
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
