"use client";

import { useState } from "react";
import { Store, InventoryEntry } from "@/types";
import { getAvailabilityStatus } from "@/lib/utils";

interface StoreWithInventory extends Store {
  inventory: InventoryEntry[];
}

export function StoreAvailability({
  stores,
  onBookTestRide,
  onReserve,
}: {
  stores: StoreWithInventory[];
  onBookTestRide: (storeId: string) => void;
  onReserve: (storeId: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(
    stores[0]?.id || null
  );

  if (stores.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        Dieses Modell ist derzeit in keinem Store in deiner Nähe verfügbar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 text-sm">
        Verfügbarkeit in deiner Nähe
      </h3>
      {stores.map((store) => {
        const availableItems = store.inventory.filter((i) => i.quantity > 0);
        const hasDemo = store.inventory.some((i) => i.isDemo && i.quantity > 0);
        const bestStatus =
          availableItems.length > 0
            ? hasDemo
              ? { label: "Sofort verfügbar · Probefahrt möglich", color: "text-green-600" }
              : { label: "Sofort verfügbar", color: "text-green-600" }
            : { label: "Demnächst verfügbar", color: "text-amber-600" };

        return (
          <div
            key={store.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === store.id ? null : store.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {store.name}
                  </p>
                  <p className={`text-xs ${bestStatus.color}`}>
                    {bestStatus.label}
                  </p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expanded === store.id ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded === store.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                <div className="space-y-2">
                  {store.inventory.map((entry, idx) => {
                    const status = getAvailabilityStatus(entry);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          Größe {entry.size} · {entry.color}
                        </span>
                        <span className={`text-xs font-medium ${status.color}`}>
                          {entry.quantity > 0 ? `${entry.quantity}x` : status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  {hasDemo && (
                    <button
                      onClick={() => onBookTestRide(store.id)}
                      className="flex-1 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg px-3 py-2 hover:bg-teal-50 transition-colors"
                    >
                      Probefahrt buchen
                    </button>
                  )}
                  {availableItems.length > 0 && (
                    <button
                      onClick={() => onReserve(store.id)}
                      className="flex-1 text-sm font-medium text-white bg-teal-600 rounded-lg px-3 py-2 hover:bg-teal-700 transition-colors"
                    >
                      Reservieren
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 pt-1">
                  <p>{store.address}, {store.postalCode} {store.city}</p>
                  <p>{store.phone}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
