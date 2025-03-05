"use client";

import { useCart } from "@/context/CartContext";
import formatCurrency from "../../../utils/formatCurrency";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CheckoutOrderSummary({ onContinue, formIsValid }) {
  const { cartItems, getTotalPrice } = useCart();

  return (
    <div className="summary-and-payment flex flex-col md:w-1/3 p-4 border-t md:border-l md:border-t-0 border-gray-300 gap-6">
      <div className="order-summary">
        <h2 className="text-2xl font-bold mb-5">Resumen</h2>
        <ul className="mb-5">
          {cartItems.map((item) => (
            <li
              key={`${item.id}-${item.attributes.join("-")}`}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.attributes.length? <p className="text-sm text-gray-600">Opción: {item.attributes.join(", ")}</p> : null}
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <span className="font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>{formatCurrency(getTotalPrice() - getTotalPrice()*0.19)}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>IVA (19%)</span>
          <span>{formatCurrency(getTotalPrice() * 0.19)}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>Descuentos</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(getTotalPrice())}</span>
        </div>
        <div className="flex justify-between pt-2">
          <Image 
            src="/1.Webpay_FB_80px.png"
            alt="webpaylogo"
            width={81}
            height={30}
          />
        </div>
      </div>
      <Button
        onClick={onContinue}
        disabled={!formIsValid}
        className="w-full"
      >
        Continuar
      </Button>
    </div>
  );
}
