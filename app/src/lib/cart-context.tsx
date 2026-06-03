"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (bikeId: string) => void;
  updateFulfillment: (bikeId: string, fulfillment: "delivery" | "pickup") => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.bikeId === item.bikeId && i.size === item.size && i.color === item.color
      );
      if (existing) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((bikeId: string) => {
    setItems((prev) => prev.filter((i) => i.bikeId !== bikeId));
  }, []);

  const updateFulfillment = useCallback(
    (bikeId: string, fulfillment: "delivery" | "pickup") => {
      setItems((prev) =>
        prev.map((i) => (i.bikeId === bikeId ? { ...i, fulfillment } : i))
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateFulfillment,
        clearCart,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
