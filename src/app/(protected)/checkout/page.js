"use client";

import { useState } from "react";
import CheckoutDetails from "@/components/checkout/CheckoutDetails";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import UserInfoForm from "@/components/checkout/UserInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import "@/lib/loader.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data: session, status } = useSession();
  const { cartItems, getTotalPrice, isCartLoaded } = useCart();
  const [currentStep, setCurrentStep] = useState("details");
  const [cartIsValid, setCartIsValid] = useState(false);
  const [userInfoValid, setUserInfoValid] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Controla si el usuario está editando su información

  const handleGuestContinue = async (formData) => {
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
        alert(errorData.error || "Hubo un error al crear el usuario invitado.");
        return;
      }

      const user = await response.json();
      alert("Usuario invitado creado exitosamente.");
      // Continuar con el flujo del checkout para el usuario invitado
    } catch (error) {
      console.error("Error interno:", error);
      alert("Error interno al crear usuario invitado.");
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

      if (!session && !guestMode) {
        alert("Debes elegir entre iniciar sesión o continuar como invitado.");
        return;
      }

      if (guestMode) {
        alert("Formulario completado correctamente.");
        // Aquí puedes proceder al siguiente paso del checkout o al resumen de la orden
      }
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
              <Link href="/productos">Ir a la tienda</Link>
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
              {currentStep === "details" && (
                <CheckoutDetails setFormIsValid={setCartIsValid} />
              )}
              {currentStep === "userInfo" && !session && !guestMode && (
                <div className="flex flex-col gap-4">
                  <p>Elige una opción para continuar:</p>
                  <Button onClick={() => setGuestMode(true)}>Seguir como invitado</Button>
                  <Button>
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                </div>
              )}
              {currentStep === "userInfo" && guestMode && (
                <UserInfoForm
                  onBack={handleBack}
                  onFormValidityChange={setUserInfoValid}
                  onSubmit={handleGuestContinue} // Enviar datos del invitado
                  isGuest={true} // Indicar que es un usuario invitado
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
                        city: Number(data.city), // Asegurar que city sea numérico
                      }),
                    });

                    if (response.ok) {
                      alert("Información actualizada exitosamente.");
                    } else {
                      alert("Error al actualizar la información.");
                    }
                  }}
                  isEditing={isEditing} // Pasar control de edición
                  setIsEditing={setIsEditing} // Permitir cambiar entre estados
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
