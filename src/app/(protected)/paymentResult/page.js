"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessfulPayment from "@/components/checkout/SuccessfulPayment";
import UnsuccessfulPayment from "@/components/checkout/UnsuccessfulPayment";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CoffeeLoader from "@/lib/CoffeeLoader";
import { useCart } from "@/context/CartContext";

export default function ResultadoTransaccion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();
  const isProcessed = useRef(false); // Bandera para evitar múltiples ejecuciones

  const mensajeFlujo2 = "El pago fue anulado por tiempo de espera.";
  const mensajeFlujo3 = "El pago fue anulado por el usuario.";
  const mensajeFlujo4 = "El pago es inválido.";

  useEffect(() => {
    // Si ya se procesó la transacción, no hacer nada
    if (isProcessed.current) return;
    isProcessed.current = true; // Marcar como procesado

    const token_ws = searchParams.get("token_ws");
    const TBK_TOKEN = searchParams.get("TBK_TOKEN");
    const TBK_ORDEN_COMPRA = searchParams.get("TBK_ORDEN_COMPRA");
    const TBK_ID_SESION = searchParams.get("TBK_ID_SESION");

    if (!token_ws && !TBK_TOKEN && !TBK_ORDEN_COMPRA && !TBK_ID_SESION) {
      router.push("/");
      return;
    }

    const processTransaction = async () => {
      try {
        if (token_ws && !TBK_TOKEN) {
          const response = await fetch("/api/transaction/commit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token_ws }),
          });

          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }

          const data = await response.json();
          console.log("data commit", data);
          setResult(data); // Guardar en el estado para la UI

          // Obtener el email del usuario asociado a la orden
          const userResponse = await fetch(`/api/order/user/${data.buy_order}`);
          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error("Error al obtener el email del usuario");
          }

          const baseUrl = process.env.NEXT_PUBLIC_API_URL;

          // Enviar correo con los detalles de la orden
          await fetch(`${baseUrl}/send/orderDetail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: data.buy_order, // Usar el buy_order de la respuesta
              email: userData.email, // Usar el email del usuario
            }),
          });

          // Actualizar la orden en la base de datos
          const updateResponse = await fetch("/api/order/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              buyOrder: data.buy_order,
              transactionStatus: data.status,
              amount: data.amount,
              authorizationCode: data.authorization_code,
              responseCode: data.response_code,
              paymentTypeCode: data.payment_type_code,
              installmentsNumber: data.installments_number,
              cardLastFourDigits: data.card_detail.card_number,
            }),
          });

          if (!updateResponse.ok) {
            throw new Error("Error al actualizar la orden");
          }

          const updatedOrder = await updateResponse.json();
          console.log("Orden actualizada:", updatedOrder);
          clearCart(); // Vaciar el carrito después de una transacción exitosa
        } else if (!token_ws && !TBK_TOKEN) {
          setResult({
            mensaje: mensajeFlujo2,
            status: "FAILED",
            data: { TBK_ORDEN_COMPRA, TBK_ID_SESION },
          });
        } else if (!token_ws && TBK_TOKEN) {
          setResult({
            mensaje: mensajeFlujo3,
            status: "FAILED",
            data: { TBK_ORDEN_COMPRA, TBK_ID_SESION },
          });
        } else if (token_ws && TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
          setResult({
            mensaje: mensajeFlujo4,
            status: "FAILED",
            data: { TBK_ORDEN_COMPRA, TBK_ID_SESION },
          });
        }
      } catch (err) {
        setError("Error al procesar la transacción o actualizar la orden");
        console.error(err);
      }
    };

    processTransaction();
  }, [searchParams, clearCart, router]);

  if (!result && !error) {
    return <CoffeeLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-lg text-red-600">{error}</p>
        <a
          href="/"
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Volver a la página principal
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      {result.status === "AUTHORIZED" ? (
        <SuccessfulPayment
          orderNumber={result.buy_order}
          amount={result.amount}
          currency="CLP"
          authorizationCode={result.authorization_code}
          transactionDate={new Date(result.transaction_date).toLocaleString("es-CL")}
          paymentType={result.payment_type_code === "VD" ? "Débito" : "Crédito"}
          installmentAmount={result.installments_number || 0}
          cardLastFourDigits={result.card_detail.card_number}
          description="Compra realizada con éxito"
        />
      ) : (
        <UnsuccessfulPayment
          orderNumber={result.buy_order}
          errorCode={result.response_code?.toString() || "Error desconocido"}
          errorMessage={result.mensaje || "La transacción no fue autorizada"}
        />
      )}
      <div className="pt-4">
        <Button>
          <Link href="/profile">Ver mis compras</Link>
        </Button>
      </div>
    </div>
  );
}