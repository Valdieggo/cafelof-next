"use client";

import { useCart } from "@/context/CartContext";
import formatCurrency from "../../../utils/formatCurrency";
import { Button } from "@/components/ui/button"; // Asegúrate de importar el componente

export default function CheckoutOrderSummary({ onContinue, formIsValid }) {
  const { getTotalPrice } = useCart();

  return (
    <div className="summary-and-payment flex flex-col md:w-1/3 p-4 border-t md:border-l md:border-t-0 border-gray-300 gap-6">
      <div className="order-summary">
        <h2 className="text-2xl font-bold mb-5">Resúmen</h2>
        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>{formatCurrency(getTotalPrice())}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>Descuentos</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(getTotalPrice())}</span>
        </div>
      </div>

      <Button
        onClick={onContinue}
        disabled={!formIsValid} // Deshabilitar si no es válido
        className="w-full"
      >
        Continuar
      </Button>
    </div>
  );
}
