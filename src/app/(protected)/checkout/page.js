"use client";

import { useState } from "react";
import CheckoutDetails from "@/components/checkout/CheckoutDetails";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import UserInfoForm from "@/components/checkout/UserInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import "@/lib/loader.css"; // Import your loader styles
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data: session, status } = useSession();
  const { cartItems, getTotalPrice, isCartLoaded } = useCart();
  const [currentStep, setCurrentStep] = useState("details");
  const [cartIsValid, setCartIsValid] = useState(false);
  const [userInfoValid, setUserInfoValid] = useState(false);

  const handleContinue = async () => {
    if (currentStep === "details") {
      setCurrentStep("userInfo");
    } else if (currentStep === "userInfo") {
      if (!userInfoValid) {
        alert("Please complete all required information before continuing.");
        return;
      }

      if (!session) {
        alert("You must be logged in to complete your purchase.");
        return;
      }

      try {
        const createOrderResponse = await fetch("/api/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            totalAmount: getTotalPrice(),
            buyOrder: session.user.id,
          }),
        });

        const createdOrder = await createOrderResponse.json();
        if (!createOrderResponse.ok) throw new Error("Failed to create order.");

        const transactionResponse = await fetch("/api/transaction/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: createdOrder.order_id,
            sessionId: session.user.id,
            amount: createdOrder.order_total_price,
          }),
        });

        const transaction = await transactionResponse.json();
        if (!transactionResponse.ok) throw new Error("Failed to create transaction.");

        window.location.href = `${transaction.url}?token_ws=${transaction.token}`;
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("There was a problem processing your request.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "userInfo") {
      setCurrentStep("details");
    }
  };

  // Show loader until session and cart data are loaded
  if (status === "loading" || !isCartLoaded) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // Show a message if the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="w-full mx-auto mt-8 mb-8 container px-4">
        <Card>
          <CardHeader>
            <CardTitle>Tu carro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Tu carro está vacío.</p>
            <Button><Link href="/productos">Ir a la tienda</Link></Button>
          </CardContent>
        </Card>
      </div>)
  }

  // Show a message if the user is not logged in and on the user info step
  if (!session && currentStep === "userInfo") {
    return <div>You must be logged in to complete your purchase.</div>;
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
                <CheckoutDetails
                  setFormIsValid={setCartIsValid}
                />
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
              formIsValid={currentStep === "details" ? cartIsValid : userInfoValid}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
