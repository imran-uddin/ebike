"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrders } from "@/lib/order-context";
import { getBikeBySlug, getStoreById, formatPrice } from "@/lib/utils";
import { stores } from "@/data/stores";

type Tab = "orders" | "payment" | "store" | "repairs" | "maintenance";

const mockPaymentMethods = [
  { id: "card-1", type: "Kreditkarte", label: "Visa ···· 4242", expiry: "12/28", isDefault: true },
  { id: "sepa-1", type: "SEPA Lastschrift", label: "DE89 ···· ···· ···· 3456", isDefault: false },
];

const mockRepairs = [
  {
    id: "REP-001",
    bike: "Cube Kathmandu Hybrid ONE 750",
    store: "duesseldorf",
    date: "2026-04-15",
    type: "Inspektion",
    status: "completed" as const,
    cost: 89,
    notes: "Erste Inspektion nach 500 km. Bremsen nachgestellt, Kette geschmiert, Speichen nachgezogen.",
  },
  {
    id: "REP-002",
    bike: "Cube Kathmandu Hybrid ONE 750",
    store: "duesseldorf",
    date: "2026-06-10",
    type: "Upgrade",
    status: "scheduled" as const,
    cost: 249,
    notes: "Upgrade auf Ergon GP3 Griffe + Brooks Cambium C17 Sattel",
  },
];

const mockMaintenancePlans = [
  {
    id: "PLAN-001",
    name: "Sorglos-Paket Premium",
    bike: "Cube Kathmandu Hybrid ONE 750",
    price: 29.90,
    interval: "monatlich",
    includes: [
      "2x Jahresinspektion",
      "Verschleißteile inklusive (Bremsbeläge, Kette, Reifen)",
      "Pannenhilfe 24/7",
      "Leih-e-Bike bei Werkstattaufenthalt",
      "Software-Updates",
    ],
    nextService: "2026-07-15",
    status: "active" as const,
  },
];

const upgradeOptions = [
  {
    id: "UPG-001",
    name: "Komfort-Paket",
    description: "Ergonomische Griffe, gefederte Sattelstütze, Komfort-Sattel",
    price: 349,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
  },
  {
    id: "UPG-002",
    name: "Sicherheits-Paket",
    description: "GPS-Tracker, Rahmenschloss, ABUS Faltschloss Bordo 6500",
    price: 289,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
  },
  {
    id: "UPG-003",
    name: "Reichweiten-Upgrade",
    description: "Zusatz-Akku 500 Wh PowerPack mit Halterung",
    price: 599,
    image: "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=400&h=300&fit=crop",
  },
  {
    id: "UPG-004",
    name: "Touring-Paket",
    description: "Ortlieb Packtaschen-Set, Garmin Edge Fahrradcomputer, Lezyne Werkzeug-Kit",
    price: 449,
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop",
  },
];

export default function AccountPage() {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [preferredStore, setPreferredStore] = useState("duesseldorf");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "orders",
      label: "Bestellungen",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: "payment",
      label: "Zahlung",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      key: "store",
      label: "Mein Store",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: "repairs",
      label: "Reparaturen & Upgrades",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: "maintenance",
      label: "Wartung",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
          <span className="text-teal-700 font-bold text-xl">M</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mein e-motion</h1>
          <p className="text-sm text-gray-500">Max Mustermann · max@example.de</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar tabs */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Meine Bestellungen</h2>
                <Link href="/orders" className="text-sm text-teal-600 font-medium hover:text-teal-700">
                  Alle anzeigen →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-500 text-sm">Noch keine Bestellungen vorhanden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const firstItem = order.items[0];
                    const bike = firstItem ? getBikeBySlug(firstItem.bikeId) : null;
                    const completedSteps = order.timeline.filter((t) => t.completed).length;
                    const totalSteps = order.timeline.length;
                    const progressPercent = (completedSteps / totalSteps) * 100;

                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center gap-4">
                          {bike && (
                            <div className="relative w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={bike.images[0]} alt="" fill className="object-cover" sizes="64px" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 text-sm">#{order.id}</p>
                              <p className="font-bold text-gray-900 text-sm">{formatPrice(order.total)}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {bike ? `${bike.brand} ${bike.model}` : ""}
                              {order.items.length > 1 ? ` + ${order.items.length - 1} weitere` : ""}
                            </p>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                              <div
                                className="bg-teal-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.timeline.find((t) => t.completed && !order.timeline[order.timeline.indexOf(t) + 1]?.completed)?.label || order.timeline[0].label}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Zahlungsmethoden</h2>

              <div className="space-y-3">
                {mockPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-xl p-4 flex items-center justify-between ${
                      method.isDefault ? "border-teal-200 bg-teal-50/50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                        {method.type === "Kreditkarte" ? (
                          <span className="text-lg">💳</span>
                        ) : (
                          <span className="text-lg">🏦</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500">
                          {method.type}
                          {method.expiry && ` · Gültig bis ${method.expiry}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                          Standard
                        </span>
                      )}
                      <button className="text-xs text-gray-500 hover:text-gray-700">Bearbeiten</button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 border border-teal-200 rounded-lg px-4 py-2.5 hover:bg-teal-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Zahlungsmethode hinzufügen
              </button>

              {/* Leasing/Financing */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Finanzierung & Leasing</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 text-sm">Klarna Ratenkauf</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Aktiv
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    12 Raten à {formatPrice(499)} · Restbetrag: {formatPrice(3493)}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "42%" }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">5 von 12 Raten bezahlt</p>
                </div>
              </div>
            </div>
          )}

          {/* Preferred Store Tab */}
          {activeTab === "store" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Mein bevorzugter Store</h2>
              <p className="text-sm text-gray-500">
                Dein bevorzugter Store wird für Verfügbarkeitsanzeigen, Abholungen und Werkstatt-Termine verwendet.
              </p>

              <div className="space-y-3">
                {stores.map((store) => {
                  const isSelected = preferredStore === store.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => setPreferredStore(store.id)}
                      className={`w-full text-left border rounded-xl p-4 transition-all ${
                        isSelected
                          ? "border-teal-600 bg-teal-50 ring-1 ring-teal-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-teal-600" : "border-gray-300"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                            <p className="text-xs text-gray-500">
                              {store.address}, {store.postalCode} {store.city}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                            Ausgewählt
                          </span>
                        )}
                      </div>
                      <div className="mt-2 ml-7 flex flex-wrap gap-1">
                        {store.services.map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Repairs & Upgrades Tab */}
          {activeTab === "repairs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Reparaturen & Upgrades</h2>
                <button className="text-sm font-medium text-white bg-teal-600 rounded-lg px-4 py-2 hover:bg-teal-700 transition-colors">
                  Termin buchen
                </button>
              </div>

              {/* History */}
              <div className="space-y-4">
                {mockRepairs.map((repair) => {
                  const store = getStoreById(repair.store);
                  return (
                    <div key={repair.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            repair.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {repair.status === "completed" ? "Abgeschlossen" : "Geplant"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(repair.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{formatPrice(repair.cost)}</p>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 text-sm">{repair.type}</p>
                          <span className="text-xs text-gray-500">{repair.id}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{repair.notes}</p>
                        <p className="text-xs text-gray-500">
                          {repair.bike} · {store?.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upgrade recommendations */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Empfohlene Upgrades</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upgradeOptions.map((upgrade) => (
                    <div key={upgrade.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32 bg-gray-100">
                        <Image src={upgrade.image} alt={upgrade.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 text-sm">{upgrade.name}</h4>
                        <p className="text-xs text-gray-500 mt-1 mb-3">{upgrade.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-900 text-sm">{formatPrice(upgrade.price)}</p>
                          <button className="text-xs font-medium text-teal-600 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors">
                            Anfragen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Wartung & Service</h2>

              {/* Active plan */}
              {mockMaintenancePlans.map((plan) => (
                <div key={plan.id} className="border border-teal-200 bg-teal-50/50 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-teal-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm font-semibold text-teal-800">Aktiver Wartungsvertrag</span>
                    </div>
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-medium">
                      {formatPrice(plan.price)}/{plan.interval === "monatlich" ? "Monat" : plan.interval}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mb-4">{plan.bike}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Nächster Service</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {new Date(plan.nextService).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className="font-medium text-green-700 text-sm flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          Aktiv
                        </p>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Inklusive Leistungen</h4>
                    <ul className="space-y-1.5">
                      {plan.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {/* Service schedule */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Service-Zeitplan</h3>
                <div className="space-y-3">
                  {[
                    { km: "500 km", name: "Erste Inspektion", date: "2026-04-15", done: true },
                    { km: "2.000 km", name: "Kleine Inspektion", date: "2026-07-15", done: false },
                    { km: "5.000 km", name: "Große Inspektion", date: "2026-12-01", done: false },
                    { km: "10.000 km", name: "Generalüberholung", date: "2027-06-01", done: false },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        service.done ? "bg-teal-100" : "bg-gray-100"
                      }`}>
                        {service.done ? (
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium text-gray-500">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${service.done ? "text-gray-500 line-through" : "text-gray-900"}`}>
                          {service.name}
                        </p>
                        <p className="text-xs text-gray-500">{service.km} · Ziel: {new Date(service.date).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}</p>
                      </div>
                      {!service.done && idx === 1 && (
                        <button className="text-xs font-medium text-teal-600 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors">
                          Termin buchen
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available plans for upsell */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Weitere Service-Pakete</h3>
                <p className="text-sm text-gray-500 mb-4">Erweitere deinen Schutz mit einem zusätzlichen Paket.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Diebstahlschutz</h4>
                    <p className="text-xs text-gray-500 mb-3">Vollkasko bei Diebstahl inkl. Neuwert-Erstattung</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-sm">ab {formatPrice(12)}/Monat</p>
                      <button className="text-xs font-medium text-teal-600">Details →</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Mobilitätsgarantie</h4>
                    <p className="text-xs text-gray-500 mb-3">Pannenhilfe, Abschleppen, Ersatz-e-Bike europaweit</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-sm">ab {formatPrice(8)}/Monat</p>
                      <button className="text-xs font-medium text-teal-600">Details →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
