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
  isCartLoaded: boolean;
  isCartOpen: boolean; // Nuevo estado para la visibilidad del carrito
  openCart: () => void; // Función para abrir el carrito
  closeCart: () => void; // Función para cerrar el carrito
  updateCartItemQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado de visibilidad

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
    openCart(); // Abrimos el carrito después de agregar un producto
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev?.filter((item) => item.id !== id) ?? []);
  };

  const getTotalItems = () =>
    cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const getTotalPrice = () =>
    cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) ?? 0;

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev?.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
          : item
      ) ?? []
    );
  };  

  const openCart = () => setIsCartOpen(true); // Función para abrir el carrito
  const closeCart = () => setIsCartOpen(false); // Función para cerrar el carrito

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
        updateCartItemQuantity,
        getTotalItems,
        getTotalPrice,
        isCartLoaded,
        isCartOpen, // Exportamos el estado de visibilidad
        openCart, // Exportamos la función para abrir el carrito
        closeCart, // Exportamos la función para cerrar el carrito
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
