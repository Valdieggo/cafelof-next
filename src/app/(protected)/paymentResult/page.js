"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessfulPayment from "@/components/checkout/SuccessfulPayment";
import UnsuccessfulPayment from "@/components/checkout/UnsuccessfulPayment";
import "@/lib/loader.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResultadoTransaccion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const mensajeFlujo2 = "El pago fue anulado por tiempo de espera.";
  const mensajeFlujo3 = "El pago fue anulado por el usuario.";
  const mensajeFlujo4 = "El pago es inválido.";

  useEffect(() => {
    const token_ws = searchParams.get("token_ws");
    const TBK_TOKEN = searchParams.get("TBK_TOKEN");
    const TBK_ORDEN_COMPRA = searchParams.get("TBK_ORDEN_COMPRA");
    const TBK_ID_SESION = searchParams.get("TBK_ID_SESION");

    if (!token_ws && !TBK_TOKEN && !TBK_ORDEN_COMPRA && !TBK_ID_SESION) {
      router.push("/");
      return;
    }

    if (token_ws && !TBK_TOKEN) {
      fetch("/api/transaction/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token_ws }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          setResult(data); // Guardar en el estado para la UI

          // Usar directamente `data` para actualizar la orden
          return fetch("/api/order/update", {
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
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar la orden");
          }
          return response.json();
        })
        .then((updatedOrder) => {
          console.log("Orden actualizada:", updatedOrder);
        })
        .catch((err) => {
          setError("Error al procesar la transacción o actualizar la orden");
          console.error(err);
        });
    } else if (!token_ws && !TBK_TOKEN) {
      setResult({ mensaje: mensajeFlujo2, status: "FAILED", data: { TBK_ORDEN_COMPRA, TBK_ID_SESION } });
    } else if (!token_ws && TBK_TOKEN) {
      setResult({ mensaje: mensajeFlujo3, status: "FAILED", data: { TBK_ORDEN_COMPRA, TBK_ID_SESION } });
    } else if (token_ws && TBK_TOKEN && TBK_ORDEN_COMPRA && TBK_ID_SESION) {
      setResult({ mensaje: mensajeFlujo4, status: "FAILED", data: { TBK_ORDEN_COMPRA, TBK_ID_SESION } });
    }
  }, [searchParams]);

  if (!result && !error) {
    return (
      <main className="flex-grow">
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </main>
    );
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
          transactionDate={new Date(result.transaction_date).toLocaleString()}
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
        <Button><Link href="/profile">Ver mis compras</Link></Button>
      </div>
    </div>
  );
}
