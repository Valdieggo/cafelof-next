"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Order {
  order_id: string;
  order_date: string;
  order_total_price: number;
  transaction_status: string;
  card_last_four: string | null;
}

interface OrderDetail {
  order_id: string;
  product_id: string;
  quantity: number;
  product: {
    product_name: string;
    product_price: number;
    product_image_url: string; 
  };
}

interface UserOrdersProps {
  userId: string;
}

export default function UserOrders({ userId }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null); // Estado para controlar la orden expandida
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/order/${userId}`, { cache: 'no-store' });
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

  const fetchOrderDetails = async (orderId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/order/details/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setOrderDetails(data);
      } else {
        setError(data.message || "Error fetching order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again later.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOrderClick = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); 
      setOrderDetails([]); 
    } else {
      setExpandedOrderId(orderId);
      await fetchOrderDetails(orderId);
    }
  };

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
              className="border border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleOrderClick(order.order_id)}
            >
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

              {/* Detalles de la orden expandida */}
              {expandedOrderId === order.order_id && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Detalles de la Orden:
                  </h4>
                  {detailsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 rounded-lg" />
                      <Skeleton className="h-12 rounded-lg" />
                    </div>
                  ) : orderDetails.length > 0 ? (
                    <div className="space-y-4">
                      {orderDetails.map((detail) => (
                        <div
                          key={`${detail.order_id}-${detail.product_id}`}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                        >
                          <div className="flex items-center gap-4 col-span-1 sm:col-span-2">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <Image
                                src={detail.product.product_image_url || "/placeholder.webp"}
                                alt={detail.product.product_name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold break-words">
                                {detail.product.product_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Cantidad: {detail.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="font-semibold">
                              {(detail.product.product_price * detail.quantity).toLocaleString("es-CL")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No se encontraron detalles para esta orden.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tiene órdenes de compra.</p>
      )}
    </div>
  );
}