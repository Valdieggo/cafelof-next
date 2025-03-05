"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
  attributes: string[]; // Attributes to distinguish product variations
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => Promise<void>;
  removeFromCart: (id: number, attributes: string[]) => Promise<void>;
  updateCartItemQuantity: (id: number, attributes: string[], quantity: number) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartLoaded: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session, status } = useSession();

  // Fetch the cart from the database or local storage
  const fetchCart = async (userId?: string) => {
    if (userId) {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${userId}` },
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } else {
      // Load the cart from local storage for unauthenticated users
      const storedCart = localStorage.getItem("cart");
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }
    setIsCartLoaded(true);
  };

  // Reload cart from local storage for unauthenticated users on every mount
  useEffect(() => {
    if (status === "unauthenticated") {
      const storedCart = localStorage.getItem("cart");
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      setIsCartLoaded(true);
    }
  }, [status]);

  // Sync local storage with `cartItems` for unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, status]);

  // Sync cart to the database on login
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const syncCartToDatabase = async () => {
        const localCart = localStorage.getItem("cart");
        const cartItems: CartItem[] = localCart ? JSON.parse(localCart) : [];

        // Check if the database cart is empty
        const response = await fetch("/api/cart", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.user.id}` },
        });

        if (!response.ok) throw new Error("Failed to fetch database cart");
        const databaseCart: CartItem[] = await response.json();

        if (databaseCart.length === 0 && cartItems.length > 0) {
          // Sync local storage cart to database if database cart is empty
          for (const item of cartItems) {
            await fetch("/api/cart/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: item.id,
                quantity: item.quantity,
                attributes: item.attributes,
                userId: session.user.id,
              }),
            });
          }
          localStorage.removeItem("cart"); // Clear local storage after sync
        }

        // Fetch the updated cart from the database
        await fetchCart(session.user.id);
      };

      syncCartToDatabase();
    }
  }, [status, session?.user?.id]);

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity: number) => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        // Primero, optimísticamente agrega el producto localmente
        setCartItems((prev) => {
          const existingItem = prev.find(
            (cartItem) =>
              cartItem.id === item.id &&
              JSON.stringify(cartItem.attributes) === JSON.stringify(item.attributes)
          );
          
          if (existingItem) {
            return prev.map((cartItem) =>
              cartItem === existingItem
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            );
          }
  
          return [...prev, { ...item, quantity }];
        });
  
        openCart();
  
        // Luego haz la llamada al servidor
        const response = await fetch("/api/cart/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            quantity,
            attributes: item.attributes,
            userId: session.user.id,
          }),
        });
  
        if (!response.ok) {
          // Manejar error, revertir cambio optimista si es necesario
          console.error("Error adding to cart");
        } else {
          // Opcionalmente, sincronizar el carrito final con el servidor
          await fetchCart(session.user.id);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Podrías revertir el cambio optimista aquí si se requiere
      }
    } else {
      // Comportamiento para no autenticados como antes
      setCartItems((prev) => {
        const existingItem = prev.find(
          (cartItem) =>
            cartItem.id === item.id &&
            JSON.stringify(cartItem.attributes) === JSON.stringify(item.attributes)
        );
  
        if (existingItem) {
          return prev.map((cartItem) =>
            cartItem === existingItem
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          );
        }
  
        return [...prev, { ...item, quantity }];
      });
  
      openCart();
    }
  };

  const removeFromCart = async (id: number, attributes: string[]) => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        await fetch(`/api/cart/remove/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attributes, userId: session.user.id }),
        });
        await fetchCart(session.user.id);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== id ||
            JSON.stringify(item.attributes) !== JSON.stringify(attributes)
        )
      );
    }
  };

  const updateCartItemQuantity = async (
    id: number,
    attributes: string[],
    quantity: number
  ) => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        await fetch("/api/cart/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: id,
            attributes,
            quantity,
            userId: session.user.id,
          }),
        });
        await fetchCart(session.user.id);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id &&
          JSON.stringify(item.attributes) === JSON.stringify(attributes)
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        await fetch(`/api/cart/clear`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        setCartItems([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalItems,
        getTotalPrice,
        isCartLoaded,
        isCartOpen,
        openCart,
        closeCart,
        clearCart,
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
