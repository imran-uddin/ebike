export interface EBike {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: Category;
  price: number;
  salePrice?: number;
  currency: "EUR";
  images: string[];
  specs: BikeSpecs;
  colors: ColorVariant[];
  sizes: FrameSize[];
  description: string;
  highlights: string[];
}

export type Category =
  | "trekking"
  | "city"
  | "mountain"
  | "cargo"
  | "urban"
  | "gravel"
  | "folding"
  | "suv";

export interface BikeSpecs {
  motor: string;
  battery: string;
  range: string;
  weight: string;
  frame: string;
  brakes: string;
  gears: string;
  display: string;
  lights: string;
  maxSpeed: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface FrameSize {
  label: string;
  cm: string;
  bodyHeight: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  hours: StoreHours;
  services: string[];
  image: string;
}

export interface StoreHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface InventoryEntry {
  bikeId: string;
  storeId: string;
  size: string;
  color: string;
  quantity: number;
  isDemo: boolean;
  availableFrom?: string;
}

export interface Appointment {
  id: string;
  bikeId: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  type: "test-ride" | "consultation" | "service";
  status: "confirmed" | "pending" | "cancelled";
}

export interface CartItem {
  bikeId: string;
  storeId: string;
  size: string;
  color: string;
  quantity: number;
  fulfillment: "delivery" | "pickup";
}
