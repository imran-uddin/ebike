"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { bikes } from "@/data/bikes";
import { BikeCard } from "@/components/BikeCard";
import { getCategoryLabel, getAllCategories, getAllBrands } from "@/lib/utils";
import { Category } from "@/types";

export default function BikesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Laden...</div>}>
      <BikesContent />
    </Suspense>
  );
}

function BikesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialSale = searchParams.get("sale") === "true";

  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    initialCategory || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [saleOnly, setSaleOnly] = useState(initialSale);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">(
    "name"
  );

  const categories = getAllCategories();
  const brands = getAllBrands();

  const filteredBikes = useMemo(() => {
    let result = [...bikes];

    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }
    if (selectedBrand !== "all") {
      result = result.filter((b) => b.brand === selectedBrand);
    }
    if (saleOnly) {
      result = result.filter((b) => b.salePrice !== undefined);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "name":
        result.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
        break;
    }

    return result;
  }, [selectedCategory, selectedBrand, saleOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg mb-4">
                e-Bikes
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {filteredBikes.length} Modelle
              </p>
            </div>

            {/* Category filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Kategorie
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Alle Kategorien
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Marke
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    selectedBrand === "all"
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Alle Marken
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      selectedBrand === brand
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Sale toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Nur % SALE</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
                  {getCategoryLabel(selectedCategory)}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1">
                    ×
                  </button>
                </span>
              )}
              {selectedBrand !== "all" && (
                <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand("all")} className="ml-1">
                    ×
                  </button>
                </span>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="name">Name A-Z</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
            </select>
          </div>

          {/* Grid */}
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">
                Keine e-Bikes mit diesen Filtern gefunden.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedBrand("all");
                  setSaleOnly(false);
                }}
                className="mt-4 text-sm text-teal-600 font-medium hover:text-teal-700"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
