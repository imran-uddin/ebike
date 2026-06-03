"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBikeBySlug, getStoresWithBike, formatPrice, getCategoryLabel } from "@/lib/utils";
import { StoreAvailability } from "@/components/StoreAvailability";
import { BookingModal } from "@/components/BookingModal";
import { getStoreById } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export default function BikeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const bike = getBikeBySlug(slug);
  const router = useRouter();
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [modalState, setModalState] = useState<{
    open: boolean;
    storeId: string;
    type: "test-ride" | "reserve";
  }>({ open: false, storeId: "", type: "test-ride" });

  if (!bike) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Bike nicht gefunden</h1>
        <Link href="/bikes" className="mt-4 inline-block text-teal-600 font-medium">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const storesWithBike = getStoresWithBike(bike.id);
  const modalStore = modalState.storeId ? getStoreById(modalState.storeId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/bikes" className="hover:text-teal-600">
          e-Bikes
        </Link>
        <span>/</span>
        <Link
          href={`/bikes?category=${bike.category}`}
          className="hover:text-teal-600"
        >
          {getCategoryLabel(bike.category)}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{bike.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
            <Image
              src={bike.images[activeImage]}
              alt={`${bike.brand} ${bike.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {bike.salePrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                SALE
              </div>
            )}
          </div>
          {bike.images.length > 1 && (
            <div className="flex gap-3">
              {bike.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === idx
                      ? "border-teal-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-teal-600 uppercase tracking-wide mb-1">
              {bike.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {bike.model}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Modelljahr {bike.year}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            {bike.salePrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(bike.salePrice)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  UVP {formatPrice(bike.price)}
                </span>
                <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded">
                  -{Math.round(((bike.price - bike.salePrice) / bike.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(bike.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{bike.description}</p>

          {/* Highlights */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">
              Highlights
            </h3>
            <ul className="space-y-1.5">
              {bike.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">Farbe</h3>
            <div className="flex gap-3">
              {bike.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedColor === color.name
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-gray-700">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">Größe</h3>
            <div className="flex flex-wrap gap-2">
              {bike.sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`border rounded-lg px-3 py-2 text-center transition-colors ${
                    selectedSize === size.label
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900">
                    {size.label}
                  </p>
                  <p className="text-xs text-gray-500">{size.bodyHeight}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            {addedToCart ? (
              <div className="flex gap-3">
                <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 font-medium py-3 rounded-lg border border-green-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Im Warenkorb
                </div>
                <button
                  onClick={() => router.push("/cart")}
                  className="flex-1 bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Zum Warenkorb
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const size = selectedSize || bike.sizes[0].label;
                  const color = selectedColor || bike.colors[0].name;
                  const store = selectedStore || storesWithBike[0]?.id || "";
                  setSelectedSize(size);
                  setSelectedColor(color);
                  setSelectedStore(store);
                  addItem({
                    bikeId: bike.id,
                    storeId: store,
                    size,
                    color,
                    quantity: 1,
                    fulfillment: "delivery",
                  });
                  setAddedToCart(true);
                }}
                className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                In den Warenkorb — {formatPrice(bike.salePrice || bike.price)}
              </button>
            )}
            <p className="text-xs text-gray-500 text-center">
              Kostenlose Lieferung ab €2.000 · 14 Tage Rückgaberecht
            </p>
          </div>

          {/* Store availability */}
          <div className="border-t border-gray-100 pt-6">
            <StoreAvailability
              stores={storesWithBike}
              onBookTestRide={(storeId) =>
                setModalState({ open: true, storeId, type: "test-ride" })
              }
              onReserve={(storeId) => {
                setSelectedStore(storeId);
                setModalState({ open: true, storeId, type: "reserve" });
              }}
            />
          </div>
        </div>
      </div>

      {/* Specs */}
      <section className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Technische Daten
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(bike.specs).map(([key, value]) => {
            const labels: Record<string, string> = {
              motor: "Motor",
              battery: "Akku",
              range: "Reichweite",
              weight: "Gewicht",
              frame: "Rahmen",
              brakes: "Bremsen",
              gears: "Schaltung",
              display: "Display",
              lights: "Beleuchtung",
              maxSpeed: "Unterstützung bis",
            };
            return (
              <div
                key={key}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <span className="text-sm text-gray-500">
                  {labels[key] || key}
                </span>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booking Modal */}
      {modalState.open && modalStore && (
        <BookingModal
          store={modalStore}
          bike={bike}
          type={modalState.type}
          onClose={() => setModalState({ open: false, storeId: "", type: "test-ride" })}
        />
      )}
    </div>
  );
}
