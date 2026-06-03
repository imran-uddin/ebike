# e-motion e-Bike Webshop POC

A high-fidelity click dummy demonstrating how [e-motion](https://emotion-ebikes.de/) can extend their retail franchise network with a digital sales channel. Built for demoing to senior e-bike industry leaders.

## Live Demo

Deploy to Vercel by connecting this repository — zero configuration needed.

## What This Demonstrates

| Capability | Description |
|------------|-------------|
| **Inventory Discovery** | Browse 12 real-brand e-bikes with store-level availability across 8 German locations |
| **Test Ride Booking** | Select bike → pick store → choose date/time → confirm appointment |
| **Online Purchase** | Full cart → 3-step checkout (shipping, payment, review) with delivery/pickup options |
| **Order Tracking** | Status timeline from confirmation through assembly to delivery |
| **After-Sales Portal** | Payment methods, preferred store, repairs & upgrades, maintenance plans |

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage — hero, categories, featured bikes, sale section |
| `/bikes` | Product listing with filters (category, brand, sale, sorting) |
| `/bikes/[slug]` | Product detail — specs, images, size/color picker, store availability, add to cart |
| `/cart` | Shopping cart with fulfillment toggle (delivery vs. store pickup) |
| `/checkout` | 3-step checkout: Shipping → Payment (Card/PayPal/Klarna/SEPA) → Place Order |
| `/orders` | Order tracking with status timeline |
| `/account` | After-sales portal (orders, payment, preferred store, repairs, maintenance) |
| `/stores` | Store finder — 8 locations with inventory stats and services |

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS 4**
- **Static mock data** (no backend, no database, no API calls)

## Getting Started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mock Data

All data is hardcoded for demo purposes:

- **12 e-bikes** — Cube, Riese & Müller, Specialized, Trek, Haibike, Urban Arrow, Scott, Gazelle, Tern, Cannondale, Brompton, Focus
- **8 stores** — Düsseldorf, Köln, München, Hamburg, Berlin, Frankfurt, Stuttgart, Freiburg
- **60+ inventory entries** — size/color/quantity/demo bike flags per store
- **Pre-seeded order** — shows mid-flight delivery tracking
- **Maintenance plan** — active "Sorglos-Paket Premium" with service schedule

## Recommended Production Architecture

This POC validates the UX. For production, the plan proposes:

- **Keep:** commercetools, Akeneo, Contentful, Algolia (already in place at e-motion)
- **Add:** Fluent Commerce (OMS), Stripe Connect (payments), Auth0 (identity)
- **Build custom (20%):** Franchise commission engine, inventory federation, lead routing

See [PLAN.md](./PLAN.md) for the full phased roadmap and architecture diagrams.

## Project Structure

```
ebike/
├── README.md
├── CLAUDE.md        ← AI assistant context
├── PLAN.md          ← Architecture & transformation plan
└── app/             ← Next.js application
    └── src/
        ├── app/         ← Pages (file-based routing)
        ├── components/  ← Shared UI components
        ├── data/        ← Mock bikes, stores, inventory
        ├── lib/         ← Utilities + React context (cart, orders)
        └── types/       ← TypeScript interfaces
```

## Deployment

```bash
# Build for production
cd app
npm run build

# Or deploy directly via Vercel CLI
npx vercel
```

## Key Design Decisions

- **German language** — matches e-motion's DACH market; informal "Du" tone
- **Teal brand color** (#0d9488) — derived from e-motion's identity
- **Store-first UX** — every product page shows local store availability; online checkout is the secondary path
- **No auth** — POC shows the experience directly without login friction
- **Client-side state** — cart and orders via React Context (resets on reload, acceptable for demo)
