"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getBikeBySlug, getStoreById, formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateFulfillment } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dein Warenkorb ist leer
        </h1>
        <p className="text-gray-500 mb-8">
          Entdecke unsere e-Bikes und finde dein perfektes Modell.
        </p>
        <Link
          href="/bikes"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          e-Bikes entdecken
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const bike = getBikeBySlug(item.bikeId);
    if (!bike) return sum;
    return sum + (bike.salePrice || bike.price) * item.quantity;
  }, 0);

  const deliveryFee = items.some((i) => i.fulfillment === "delivery") ? 49 : 0;
  const freeDelivery = subtotal >= 2000;
  const total = subtotal + (freeDelivery ? 0 : deliveryFee);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const bike = getBikeBySlug(item.bikeId);
            const store = getStoreById(item.storeId);
            if (!bike) return null;

            return (
              <div
                key={item.bikeId}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-20 sm:w-32 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={bike.images[0]}
                      alt={`${bike.brand} ${bike.model}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-teal-600 uppercase">
                          {bike.brand}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {bike.model}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Größe {item.size} · {item.color}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                        {formatPrice(bike.salePrice || bike.price)}
                      </p>
                    </div>

                    {/* Fulfillment options */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateFulfillment(item.bikeId, "delivery")}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            item.fulfillment === "delivery"
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Lieferung nach Hause
                        </button>
                        <button
                          onClick={() => updateFulfillment(item.bikeId, "pickup")}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            item.fulfillment === "pickup"
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Abholung im Store
                        </button>
                      </div>
                      {store && (
                        <p className="text-xs text-gray-500">
                          von {store.name}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.bikeId)}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Zusammenfassung</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Zwischensumme</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lieferung</span>
                <span className="font-medium text-gray-900">
                  {freeDelivery ? (
                    <span className="text-green-600">Kostenlos</span>
                  ) : items.every((i) => i.fulfillment === "pickup") ? (
                    <span className="text-green-600">Kostenlos (Abholung)</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Gesamt</span>
                <span className="font-bold text-gray-900 text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full text-center bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Zur Kasse
            </Link>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                14 Tage Rückgaberecht
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Professionelle Montage inklusive
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sichere Bezahlung
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
