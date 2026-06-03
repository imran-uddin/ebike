"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useOrders, Order } from "@/lib/order-context";
import { getBikeBySlug, getStoreById, formatPrice } from "@/lib/utils";
import Link from "next/link";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [payment, setPayment] = useState({
    method: "card" as "card" | "paypal" | "klarna" | "sepa",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kein Artikel im Warenkorb</h1>
        <Link href="/bikes" className="text-teal-600 font-medium">
          Zurück zum Shop
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const bike = getBikeBySlug(item.bikeId);
    return sum + ((bike?.salePrice || bike?.price || 0) * item.quantity);
  }, 0);
  const deliveryFee = items.some((i) => i.fulfillment === "delivery") && subtotal < 2000 ? 49 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order: Order = {
        id: `EM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        items: [...items],
        status: "confirmed",
        timeline: [
          { status: "confirmed", label: "Bestellung bestätigt", timestamp: new Date().toISOString(), completed: true },
          { status: "preparing", label: "Montage wird vorbereitet", timestamp: "", completed: false },
          { status: "ready", label: "Zur Auslieferung bereit", timestamp: "", completed: false },
          { status: "delivering", label: "Unterwegs zu dir", timestamp: "", completed: false },
          { status: "delivered", label: "Zugestellt", timestamp: "", completed: false },
        ],
        customer: shipping,
        payment: {
          method: payment.method === "card" ? "Kreditkarte" : payment.method === "paypal" ? "PayPal" : payment.method === "klarna" ? "Klarna" : "SEPA",
          last4: payment.method === "card" ? payment.cardNumber.slice(-4) : undefined,
        },
        total,
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      clearCart();
      router.push(`/orders?new=${order.id}`);
    }, 2000);
  };

  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Lieferadresse" },
    { key: "payment", label: "Zahlung" },
    { key: "review", label: "Prüfen & Bestellen" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s.key
                  ? "bg-teal-600 text-white"
                  : steps.indexOf(steps.find((st) => st.key === step)!) > idx
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                step === s.key ? "font-medium text-gray-900" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-8 sm:w-12 h-px bg-gray-200 mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main form */}
        <div className="lg:col-span-3">
          {/* Step 1: Shipping */}
          {step === "shipping" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Lieferadresse</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="max@example.de"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="+49 170 1234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Musterstraße 42"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="40210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stadt</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Düsseldorf"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Weiter zur Zahlung
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Zahlungsart</h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "card", label: "Kreditkarte", icon: "💳" },
                  { key: "paypal", label: "PayPal", icon: "🅿️" },
                  { key: "klarna", label: "Klarna Ratenkauf", icon: "🔄" },
                  { key: "sepa", label: "SEPA Lastschrift", icon: "🏦" },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPayment({ ...payment, method: m.key as typeof payment.method })}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-colors text-left ${
                      payment.method === m.key
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{m.label}</span>
                  </button>
                ))}
              </div>

              {payment.method === "card" && (
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kartennummer</label>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ablaufdatum</label>
                      <input
                        type="text"
                        value={payment.cardExpiry}
                        onChange={(e) => setPayment({ ...payment, cardExpiry: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input
                        type="text"
                        value={payment.cardCvc}
                        onChange={(e) => setPayment({ ...payment, cardCvc: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {payment.method === "klarna" && (
                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-sm text-pink-800">
                  Bezahle bequem in 3–24 Monatsraten. Ab {formatPrice(Math.round(total / 12))}/Monat.
                </div>
              )}

              {payment.method === "paypal" && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                  Du wirst nach Überprüfung zu PayPal weitergeleitet.
                </div>
              )}

              {payment.method === "sepa" && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                  Der Betrag wird innerhalb von 2-3 Werktagen von deinem Konto abgebucht.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  onClick={() => setStep("review")}
                  className="flex-1 bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Weiter zur Übersicht
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Bestellung prüfen</h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Lieferadresse</h3>
                  <button onClick={() => setStep("shipping")} className="text-xs text-teal-600 font-medium">
                    Ändern
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {shipping.name}<br />
                  {shipping.address}<br />
                  {shipping.postalCode} {shipping.city}
                </p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Zahlung</h3>
                  <button onClick={() => setStep("payment")} className="text-xs text-teal-600 font-medium">
                    Ändern
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {payment.method === "card" && `Kreditkarte ···· ${payment.cardNumber.slice(-4) || "4242"}`}
                  {payment.method === "paypal" && "PayPal"}
                  {payment.method === "klarna" && `Klarna Ratenkauf · ${formatPrice(Math.round(total / 12))}/Monat`}
                  {payment.method === "sepa" && "SEPA Lastschrift"}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const bike = getBikeBySlug(item.bikeId);
                  const store = getStoreById(item.storeId);
                  if (!bike) return null;
                  return (
                    <div key={item.bikeId} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                      <div className="relative w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image src={bike.images[0]} alt="" fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {bike.brand} {bike.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.size} · {item.color} · {item.fulfillment === "delivery" ? "Lieferung" : "Abholung"} {store ? `(${store.city})` : ""}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
                        {formatPrice(bike.salePrice || bike.price)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Wird bearbeitet...
                    </span>
                  ) : (
                    `Jetzt kaufen — ${formatPrice(total)}`
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Mit dem Kauf akzeptierst du unsere AGB und Datenschutzbestimmungen.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">
              Bestellübersicht
            </h3>
            <div className="space-y-3">
              {items.map((item) => {
                const bike = getBikeBySlug(item.bikeId);
                if (!bike) return null;
                return (
                  <div key={item.bikeId} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {bike.brand} {bike.model}
                    </span>
                    <span className="font-medium text-gray-900 whitespace-nowrap">
                      {formatPrice(bike.salePrice || bike.price)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lieferung</span>
                  <span className="font-medium text-green-600">
                    {deliveryFee === 0 ? "Kostenlos" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Gesamt</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
