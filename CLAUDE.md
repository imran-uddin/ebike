# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

POC click-dummy webshop for [e-motion (emotion-ebikes.de)](https://emotion-ebikes.de/) — demonstrating an additional digital sales channel alongside 100+ retail franchise stores. Built to demo to senior e-bike industry leaders on Vercel.

The webshop supports: inventory visibility across stores, test-ride booking, online purchase with store fulfillment, and after-sales account management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Data | Static mock JSON (no backend/integrations) |
| Hosting | Vercel |

## Project Structure

```
ebike/
├── CLAUDE.md          ← this file
├── PLAN.md            ← architecture & transformation plan
└── app/               ← Next.js application
    └── src/
        ├── app/       ← pages (file-based routing)
        │   ├── page.tsx           ← homepage
        │   ├── bikes/page.tsx     ← product listing (PLP)
        │   ├── bikes/[slug]/      ← product detail (PDP)
        │   ├── cart/              ← shopping cart
        │   ├── checkout/          ← 3-step checkout
        │   ├── orders/            ← order tracking
        │   ├── account/           ← after-sales portal
        │   └── stores/            ← store finder
        ├── components/  ← shared UI components
        ├── data/        ← mock data (bikes, stores, inventory)
        ├── lib/         ← utilities + React context providers
        └── types/       ← TypeScript interfaces
```

## Commands

```bash
cd ebike/app
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (also runs TypeScript check)
npm run lint         # ESLint
```

## Mock Data

All data is static — no API calls or database. Mocked entities:

- **12 e-bikes** from real brands (Cube, Riese & Müller, Specialized, Trek, Haibike, Urban Arrow, Scott, Gazelle, Tern, Cannondale, Brompton, Focus)
- **8 stores** across German cities (Düsseldorf, Köln, München, Hamburg, Berlin, Frankfurt, Stuttgart, Freiburg)
- **60+ inventory entries** with size/color/quantity/demo flags
- **1 pre-seeded order** (Charger4 GT vario, "preparing" status) for demo
- **After-sales mock data** — payment methods, repair history, maintenance plan, upgrade packages

## Architecture Decisions

- **Client-side state** via React Context (CartProvider, OrderProvider) — no persistence across sessions (acceptable for POC)
- **No authentication** — account page shows mock user data directly
- **German language UI** — matches e-motion's market; uses informal "Du" tone
- **Unsplash images** — placeholder imagery; configured in `next.config.ts` remotePatterns
- **Brand colors** — teal-600 primary (#0d9488), matching e-motion's green/teal identity

## Key User Flows

1. **Browse → PDP → Add to Cart → Checkout** — full purchase flow
2. **PDP → Store Availability → Book Test Ride** — appointment scheduling
3. **PDP → Store Availability → Reserve** — hold bike 48h at store
4. **Account → Repairs & Upgrades** — post-purchase service booking
5. **Account → Maintenance** — active service plan with km-based schedule

## Recommended Production Architecture

See PLAN.md for the full transformation plan. Summary:

- commercetools (commerce), Akeneo (PIM), Contentful (CMS), Algolia (search)
- Add: Fluent Commerce (OMS), Stripe Connect (payments), Auth0 (identity)
- Buy 80%, build 20% (custom: franchise commission, inventory federation, lead routing)
