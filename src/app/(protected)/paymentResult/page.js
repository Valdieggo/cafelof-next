"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SuccessfulPayment from "@/components/checkout/SuccessfulPayment";
import UnsuccessfulPayment from "@/components/checkout/UnsuccessfulPayment";

export default function ResultadoTransaccion() {
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
          setResult(data);
        })
        .catch((err) => {
          setError("Error al procesar la transacción");
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
      <div className="flex flex-col items-center justify-center h-screen text-gray-800">
        <p className="text-lg font-semibold">Procesando resultado...</p>
      </div>
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
          feeType="IVA"
          feeAmount={0}
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
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Volver a la página principal
      </a>
    </div>
  );
}
