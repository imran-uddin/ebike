import { bikes } from "@/data/bikes";
import { stores } from "@/data/stores";
import { inventory } from "@/data/inventory";
import { EBike, Store, InventoryEntry, Category } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getBikeBySlug(slug: string): EBike | undefined {
  return bikes.find((b) => b.slug === slug);
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function getInventoryForBike(bikeId: string): InventoryEntry[] {
  return inventory.filter((i) => i.bikeId === bikeId);
}

export function getInventoryForStore(storeId: string): InventoryEntry[] {
  return inventory.filter((i) => i.storeId === storeId);
}

export function getStoresWithBike(bikeId: string): (Store & { inventory: InventoryEntry[] })[] {
  const bikeInventory = getInventoryForBike(bikeId);
  const storeIds = [...new Set(bikeInventory.map((i) => i.storeId))];

  return storeIds
    .map((storeId) => {
      const store = getStoreById(storeId);
      if (!store) return null;
      return {
        ...store,
        inventory: bikeInventory.filter((i) => i.storeId === storeId),
      };
    })
    .filter(Boolean) as (Store & { inventory: InventoryEntry[] })[];
}

export function getBikesByCategory(category: Category): EBike[] {
  return bikes.filter((b) => b.category === category);
}

export function getBikesOnSale(): EBike[] {
  return bikes.filter((b) => b.salePrice !== undefined);
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    trekking: "Trekking e-Bike",
    city: "City e-Bike",
    mountain: "e-Mountainbike",
    cargo: "Lastenrad",
    urban: "Urban e-Bike",
    gravel: "Gravel e-Bike",
    folding: "Falt- & Kompakt e-Bike",
    suv: "SUV e-Bike",
  };
  return labels[category];
}

export function getAllCategories(): Category[] {
  return [...new Set(bikes.map((b) => b.category))];
}

export function getAllBrands(): string[] {
  return [...new Set(bikes.map((b) => b.brand))].sort();
}

export function getAvailabilityStatus(entry: InventoryEntry): {
  label: string;
  color: string;
} {
  if (entry.quantity > 0 && entry.isDemo) {
    return { label: "Sofort verfügbar · Probefahrt möglich", color: "text-green-600" };
  }
  if (entry.quantity > 0) {
    return { label: "Sofort verfügbar", color: "text-green-600" };
  }
  if (entry.availableFrom) {
    const date = new Date(entry.availableFrom);
    const formatted = date.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
    return { label: `Verfügbar ab ${formatted}`, color: "text-amber-600" };
  }
  return { label: "Nicht verfügbar", color: "text-red-600" };
}
