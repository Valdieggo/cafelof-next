"use client";

import { useCart } from "@/context/CartContext";
import formatCurrency from "../../../utils/formatCurrency";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function CheckoutDetails({ setFormIsValid }) {
  const { cartItems } = useCart();

  useEffect(() => {
    setFormIsValid(cartItems.length > 0);
  }, [cartItems, setFormIsValid]);

  return (
    <div className="cart-details flex-1 p-4">
      {cartItems.map((item, index) => (
        <div key={item.id}>
          <div className="cart-item grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-4">
            <a
              href={`/productos/${item.id}`}
              className="flex items-center gap-4 col-span-1 sm:col-span-2"
            >
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="text-lg font-semibold break-words">
                {item.title}
              </h3>
            </a>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-6 col-span-1">
              <div className="flex items-center gap-2">
                <Button className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded">
                  -
                </Button>
                <span className="text-center w-8">{item.quantity}</span>
                <Button className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded">
                  +
                </Button>
              </div>
              <span className="font-semibold">{formatCurrency(item.price)}</span>
            </div>
          </div>
          {index < cartItems.length - 1 && (
            <hr className="border-t border-gray-300 my-4" />
          )}
        </div>
      ))}
    </div>
  );
}
