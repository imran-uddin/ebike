import Link from "next/link";
import Image from "next/image";
import { bikes } from "@/data/bikes";
import { BikeCard } from "@/components/BikeCard";
import { getCategoryLabel, getAllCategories, getBikesOnSale } from "@/lib/utils";

export default function HomePage() {
  const saleBikes = getBikesOnSale();
  const categories = getAllCategories();
  const featuredBikes = bikes.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1920&h=800&fit=crop"
            alt="e-Bike fahren"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
            Dein e-Bike.
            <br />
            Online entdecken.
            <br />
            Vor Ort erleben.
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-lg">
            Finde dein perfektes e-Bike, prüfe die Verfügbarkeit in deinem Store
            und buche deine Probefahrt — alles in einem Schritt.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/bikes"
              className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              e-Bikes entdecken
            </Link>
            <Link
              href="/stores"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              Händler finden
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-500">Standorte</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">30+</p>
              <p className="text-sm text-gray-500">Premium Marken</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">20.000+</p>
              <p className="text-sm text-gray-500">5-Sterne Bewertungen</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Kostenlos</p>
              <p className="text-sm text-gray-500">Beratung & Probefahrt</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Finde dein e-Bike
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/bikes?category=${cat}`}
              className="group relative bg-gray-100 rounded-xl p-6 hover:bg-teal-50 hover:ring-1 hover:ring-teal-200 transition-all"
            >
              <p className="font-semibold text-gray-900 group-hover:text-teal-700 text-sm">
                {getCategoryLabel(cat)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {bikes.filter((b) => b.category === cat).length} Modelle
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured bikes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Unsere Empfehlungen</h2>
          <Link
            href="/bikes"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Alle ansehen →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </section>

      {/* Sale */}
      {saleBikes.length > 0 && (
        <section className="bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">% SALE</h2>
              <Link
                href="/bikes?sale=true"
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Alle Sale-Bikes →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {saleBikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-teal-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Bereit für deine Probefahrt?
          </h2>
          <p className="text-teal-100 mb-8 max-w-md mx-auto">
            Finde dein Wunsch-Bike, prüfe die Verfügbarkeit und buche deinen
            Termin — kostenlos und unverbindlich.
          </p>
          <Link
            href="/bikes"
            className="inline-flex items-center px-6 py-3 bg-white text-teal-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            e-Bikes durchstöbern
          </Link>
        </div>
      </section>
    </div>
  );
}
