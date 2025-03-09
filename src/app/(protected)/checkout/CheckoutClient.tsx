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
import CoffeeLoader from "@/lib/CoffeeLoader";
import { useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";

export default function CheckoutClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, getTotalPrice, isCartLoaded } = useCart();

  const [currentStep, setCurrentStep] = useState("details");
  const [cartIsValid, setCartIsValid] = useState(false);
  const [userInfoValid, setUserInfoValid] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [guestUserId, setGuestUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <CoffeeLoader />
    );
  }

  const handleGuestContinue = async (formData: any) => {

    const response = await fetch(`/api/auth/user/get/${formData.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },  
    });
    const userGuestExists = await response.json();

    if(!userGuestExists.message){
      setGuestUserId(userGuestExists.id);
      toast.info("Información guardada exitosamente", {
        duration: 4000,
        progress: false,
        position: "bottom-center",
        transition: "popUp",
        icon: '',
        sound: false,
      });
      return;
    }

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
        toast.error(errorData.error || "Hubo un error al ingresar los datos", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: '',
          sound: false,
        });
        return;
      }

      const user = await response.json();
      setGuestUserId(user.user.id);
      toast.info("Información guardada exitosamente", {
        duration: 4000,
        progress: false,
        position: "bottom-center",
        transition: "popUp",
        icon: '',
        sound: false,
      });
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
          cartItems,
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

      setIsLoading(true);
      await createOrderAndTransaction(userId);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "userInfo") {
      setCurrentStep("details");
    }
  };

  if (status === "loading" || !isCartLoaded) {
    return (
      <CoffeeLoader />
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
            <Link href="/productos">
              <Button>
                Ver productos
              </Button>
            </Link>
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
                  <Button onClick={() => router.push("/login?redirectTo=/checkout")}>
                    Iniciar sesión
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
                    console.log("data: ", data);
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
