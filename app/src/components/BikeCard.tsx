import Link from "next/link";
import Image from "next/image";
import { EBike } from "@/types";
import { formatPrice, getCategoryLabel } from "@/lib/utils";

export function BikeCard({ bike }: { bike: EBike }) {
  return (
    <Link
      href={`/bikes/${bike.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image
          src={bike.images[0]}
          alt={`${bike.brand} ${bike.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {bike.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            SALE
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-2 py-1 rounded">
          {getCategoryLabel(bike.category)}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">
          {bike.brand}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-teal-600 transition-colors">
          {bike.model}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {bike.specs.motor} · {bike.specs.battery}
        </p>

        <div className="flex items-baseline gap-2">
          {bike.salePrice ? (
            <>
              <span className="font-bold text-red-600">
                {formatPrice(bike.salePrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(bike.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">
              {formatPrice(bike.price)}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-1">
          {bike.colors.map((color) => (
            <span
              key={color.name}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
