"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrders } from "@/lib/order-context";
import { getBikeBySlug, getStoreById, formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">Laden...</div>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { orders } = useOrders();
  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Noch keine Bestellungen
        </h1>
        <p className="text-gray-500 mb-8">
          Sobald du eine Bestellung aufgibst, wird sie hier angezeigt.
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Meine Bestellungen
      </h1>

      {newOrderId && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-green-900">Bestellung erfolgreich!</h2>
              <p className="text-sm text-green-700">
                Bestellnummer: {newOrderId}
              </p>
            </div>
          </div>
          <p className="text-sm text-green-700 ml-13">
            Vielen Dank für deine Bestellung. Du erhältst in Kürze eine Bestätigung per E-Mail.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStepIndex = order.timeline.findIndex((t) => !t.completed);
          const activeStep = currentStepIndex === -1 ? order.timeline.length - 1 : currentStepIndex - 1;

          return (
            <div
              key={order.id}
              className={`border rounded-xl overflow-hidden ${
                newOrderId === order.id ? "border-green-300 ring-2 ring-green-100" : "border-gray-200"
              }`}
            >
              {/* Order header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    Bestellung #{order.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Bestellt am{" "}
                    {new Date(order.createdAt).toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.payment.method}
                    {order.payment.last4 && ` ···· ${order.payment.last4}`}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {/* Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item, idx) => {
                    const bike = getBikeBySlug(item.bikeId);
                    const store = getStoreById(item.storeId);
                    if (!bike) return null;
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={bike.images[0]} alt="" fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {bike.brand} {bike.model}
                          </p>
                          <p className="text-xs text-gray-500">
                            Größe {item.size} · {item.color}
                          </p>
                          {store && (
                            <p className="text-xs text-gray-500">
                              {item.fulfillment === "delivery" ? "Lieferung von" : "Abholung bei"} {store.name}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Timeline */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">
                    Bestellstatus
                  </h3>
                  <div className="space-y-0">
                    {order.timeline.map((event, idx) => {
                      const isCompleted = event.completed;
                      const isCurrent = idx === activeStep + 1;
                      const isPast = idx <= activeStep;

                      return (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                isCompleted
                                  ? "bg-teal-600"
                                  : isCurrent
                                  ? "bg-teal-200 ring-4 ring-teal-50"
                                  : "bg-gray-200"
                              }`}
                            />
                            {idx < order.timeline.length - 1 && (
                              <div
                                className={`w-0.5 h-8 ${
                                  isPast ? "bg-teal-600" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pb-6">
                            <p
                              className={`text-sm ${
                                isCompleted || isCurrent
                                  ? "font-medium text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {event.label}
                            </p>
                            {event.timestamp && (
                              <p className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleDateString("de-DE", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery info */}
                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Lieferadresse
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer.name}<br />
                      {order.customer.address}<br />
                      {order.customer.postalCode} {order.customer.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-medium border border-gray-200 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      Store kontaktieren
                    </button>
                    <button className="text-xs font-medium bg-teal-600 text-white rounded-lg px-3 py-2 hover:bg-teal-700 transition-colors">
                      Lieferung verfolgen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
