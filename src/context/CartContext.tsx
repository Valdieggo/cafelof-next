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
  isCartLoaded: boolean; // Añadimos un estado de carga.
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      setCartItems([]); // Inicializamos con un array vacío.
    }
    setIsCartLoaded(true); // Marcamos como cargado después de la inicialización.
  }, []);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    setCartItems((prev) => {
      if (!prev) return prev;
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
    setCartItems((prev) => prev?.filter((item) => item.id !== id) ?? []);
  };

  const getTotalItems = () =>
    cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const getTotalPrice = () =>
    cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;

  useEffect(() => {
    if (cartItems !== null) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems || [],
        addToCart,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        isCartLoaded, // Exportamos el estado de carga.
      }}
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
