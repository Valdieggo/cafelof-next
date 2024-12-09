"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  order_id: string;
  order_date: string;
  order_total_price: number;
  transaction_status: string;
  card_last_four: string | null;
}

interface UserOrdersProps {
  userId: string;
}

export default function UserOrders({ userId }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/order/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Error fetching orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Mis Órdenes</h2>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">
                  Orden #{order.order_id}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.transaction_status === "AUTHORIZED"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.transaction_status}
                </span>
              </div>

              {/* Order Details */}
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Fecha de creación:{" "}
                  {new Date(order.order_date).toLocaleDateString("es-CL")}
                </p>
                <p>Total: ${order.order_total_price.toLocaleString("es-CL")}</p>
                <p>
                  Tarjeta:{" "}
                  {order.card_last_four ? (
                    `**** **** **** ${order.card_last_four}`
                  ) : (
                    <span className="italic text-gray-400">No disponible</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tiene órdenes de compra.</p>
      )}
    </div>
  );
}
