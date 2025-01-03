"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import CheckoutDetails from "@/components/checkout/CheckoutDetails";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import UserInfoForm from "@/components/checkout/UserInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "@/lib/loader.css";

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const { cartItems, getTotalPrice, isCartLoaded } = useCart();

  const [currentStep, setCurrentStep] = useState("details");
  const [cartIsValid, setCartIsValid] = useState(false);
  const [userInfoValid, setUserInfoValid] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [guestUserId, setGuestUserId] = useState(null);

  const handleGuestContinue = async (formData: any) => {
    try {
      const response = await fetch("/api/auth/user/create-guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creando usuario invitado:", errorData.error);
        alert(errorData.error || "Hubo un error al ingresar los datos");
        return;
      }

      const user = await response.json();
      setGuestUserId(user.user.id);
      alert("Información guardada exitosamente.");
    } catch (error) {
      console.error("Error interno", error);
    }
  };

  const createOrderAndTransaction = async (userId: string) => {
    if (!userId) {
      alert("Error: No se pudo obtener el ID del usuario.");
      console.error("Error: userId no está definido.");
      return;
    }

    try {
      const createOrderResponse = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          totalAmount: getTotalPrice(),
          buyOrder: userId,
        }),
      });

      if (!createOrderResponse.ok) throw new Error("No se pudo crear la orden.");
      const createdOrder = await createOrderResponse.json();

      const transactionResponse = await fetch("/api/transaction/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: createdOrder.order_id,
          sessionId: userId,
          amount: createdOrder.order_total_price,
        }),
      });

      if (!transactionResponse.ok) throw new Error("No se pudo crear la transacción.");
      const transaction = await transactionResponse.json();

      window.location.href = `${transaction.url}?token_ws=${transaction.token}`;
    } catch (error) {
      console.error("Error durante el checkout:", error);
      alert("Hubo un problema al procesar tu solicitud.");
    }
  };

  const handleContinue = async () => {
    if (currentStep === "details") {
      setCurrentStep("userInfo");
    } else if (currentStep === "userInfo") {
      if (!userInfoValid) {
        alert("Por favor completa toda la información requerida antes de continuar.");
        return;
      }

      const userId = guestMode ? guestUserId : session?.user?.id;

      if (!userId) {
        alert("No se pudo completar la operación: usuario no identificado.");
        console.error("Error: userId no está definido.");
        return;
      }

      await createOrderAndTransaction(userId);
    }
  };

  const handleBack = () => {
    if (currentStep === "userInfo") {
      setCurrentStep("details");
    }
  };

  if (status === "loading" || !isCartLoaded) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full mx-auto mt-8 mb-8 container px-4">
        <Card>
          <CardHeader>
            <CardTitle>Tu carro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tu carro está vacío.</p>
            <Button>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
              {currentStep === "details" && <CheckoutDetails setFormIsValid={setCartIsValid} />}
              {currentStep === "userInfo" && !session && !guestMode && (
                <div className="flex flex-col gap-4 mx-12">
                  <p>Elige una opción para continuar:</p>
                  <Button onClick={() => setGuestMode(true)}>Seguir como invitado</Button>
                  <Button>
                    <Link href="/login?redirectTo=/checkout">Iniciar sesión</Link>
                  </Button>
                </div>
              )}
              {currentStep === "userInfo" && guestMode && (
                <UserInfoForm
                  onBack={handleBack}
                  onFormValidityChange={setUserInfoValid}
                  onSubmit={handleGuestContinue}
                  isGuest
                />
              )}
              {currentStep === "userInfo" && session && (
                <UserInfoForm
                  onBack={handleBack}
                  onFormValidityChange={setUserInfoValid}
                  onSubmit={async (data) => {
                    const response = await fetch("/api/auth/user/update", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...data,
                        city: Number(data.city),
                      }),
                    });

                    if (response.ok) {
                      alert("Información actualizada exitosamente.");
                    } else {
                      alert("Error al actualizar la información.");
                    }
                  }}
                />
              )}
            </div>
            <CheckoutOrderSummary
              onContinue={handleContinue}
              formIsValid={currentStep === "details" ? cartIsValid : userInfoValid}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
