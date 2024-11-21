"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Solo ejecutamos efectos relacionados con localStorage en el cliente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setIsMounted(true); // Ahora el componente está montado
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isMounted) return null; // Retrasamos el renderizado si el componente aún no está montado

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
