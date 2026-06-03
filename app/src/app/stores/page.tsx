import Link from "next/link";
import { stores } from "@/data/stores";
import { getInventoryForStore } from "@/lib/utils";
import { bikes } from "@/data/bikes";

export default function StoresPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          e-Bike Händler in der Nähe
        </h1>
        <p className="text-gray-500 mt-1">
          Finde jetzt deinen e-motion e-Bike Shop
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const storeInventory = getInventoryForStore(store.id);
          const availableBikes = storeInventory.filter((i) => i.quantity > 0);
          const uniqueBikeIds = [...new Set(availableBikes.map((i) => i.bikeId))];
          const demoBikes = storeInventory.filter((i) => i.isDemo && i.quantity > 0);

          return (
            <div
              key={store.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">
                      {store.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {store.address}, {store.postalCode} {store.city}
                    </p>
                  </div>
                </div>

                {/* Inventory stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {uniqueBikeIds.length}
                    </p>
                    <p className="text-xs text-gray-500">Modelle</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {availableBikes.reduce((sum, i) => sum + i.quantity, 0)}
                    </p>
                    <p className="text-xs text-gray-500">Auf Lager</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-teal-600">
                      {demoBikes.length}
                    </p>
                    <p className="text-xs text-gray-500">Probefahrt</p>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {store.services.slice(0, 3).map((service) => (
                    <span
                      key={service}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {service}
                    </span>
                  ))}
                  {store.services.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{store.services.length - 3}
                    </span>
                  )}
                </div>

                {/* Hours */}
                <div className="text-xs text-gray-500 mb-4">
                  <p>Mo–Fr: {store.hours.monday}</p>
                  <p>Sa: {store.hours.saturday}</p>
                </div>

                {/* Contact */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${store.phone}`}
                    className="flex-1 text-center text-sm font-medium border border-gray-200 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Anrufen
                  </a>
                  <Link
                    href={`/bikes`}
                    className="flex-1 text-center text-sm font-medium bg-teal-600 text-white rounded-lg px-3 py-2 hover:bg-teal-700 transition-colors"
                  >
                    Bikes ansehen
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
