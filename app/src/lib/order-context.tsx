"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem } from "@/types";

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  timeline: OrderEvent[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  payment: {
    method: string;
    last4?: string;
  };
  total: number;
  createdAt: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered";

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "EM-2026-48291",
      items: [
        {
          bikeId: "riese-mueller-charger4-gt-vario",
          storeId: "duesseldorf",
          size: "M",
          color: "Petrol Metallic",
          quantity: 1,
          fulfillment: "delivery",
        },
      ],
      status: "preparing",
      timeline: [
        { status: "confirmed", label: "Bestellung bestätigt", timestamp: "2026-05-28T10:30:00", completed: true },
        { status: "preparing", label: "Montage bei e-motion Düsseldorf", timestamp: "2026-05-30T09:00:00", completed: true },
        { status: "ready", label: "Zur Auslieferung bereit", timestamp: "", completed: false },
        { status: "delivering", label: "Unterwegs zu dir", timestamp: "", completed: false },
        { status: "delivered", label: "Zugestellt", timestamp: "", completed: false },
      ],
      customer: {
        name: "Max Mustermann",
        email: "max@example.de",
        phone: "+49 170 1234567",
        address: "Königsallee 92",
        city: "Düsseldorf",
        postalCode: "40212",
      },
      payment: {
        method: "Kreditkarte",
        last4: "4242",
      },
      total: 5999,
      createdAt: "2026-05-28T10:30:00",
    },
  ]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
}
