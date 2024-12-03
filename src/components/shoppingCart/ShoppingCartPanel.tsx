import { useEffect } from "react";
import CartItem from "./CartItem";
import formatCurrency from "../../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShoppingCartPanel({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();

  // Deshabilitar scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Limpieza: eliminar la clase al desmontar el componente
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tu Carrito</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-600">
            &times;
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Comienza a agregar tus productos</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price * item.quantity}
                  quantity={item.quantity}
                  image={item.image}
                  onRemove={removeFromCart}
                />
              ))}
            </ul>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal</span>
              <span className="text-lg font-bold">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>
            <Button
              variant="default"
              className="w-full text-center"
            >
              <Link href="/checkout" className="block w-full h-full">
                Proceder al pago
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
