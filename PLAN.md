# PLAN.md — e-motion Webshop Transformation

## 1. Design Language Analysis

### Current Brand Identity

| Element | Current State |
|---------|--------------|
| **Colors** | White/light backgrounds, dark text, brand green/teal accents, high contrast |
| **Typography** | Clean sans-serif, bold weights for headlines, clear hierarchy (H1→H3) |
| **Tone** | Informal "Du" German, approachable expert, community-focused |
| **Photography** | Lifestyle-driven — real people, natural light, everyday use cases over extreme sport |
| **Layout** | Modular section-based (Next.js), full-width heroes, alternating text/image blocks, card grids |
| **CTAs** | Dual-CTA pattern — primary action + "Mehr erfahren" secondary |

### Design Principles to Preserve in Webshop

- **Local-first messaging** — every page connects back to a physical store
- **Trust signals** — 20,000+ five-star reviews, expert credentials, guarantees
- **Lifestyle over spec-sheet** — imagery shows outcomes (family trips, commutes), not just product glamour
- **Generous whitespace** — clean, uncluttered sections with breathing room
- **Progressive disclosure** — filters load dynamically, "Mehr anzeigen" expandables

### Design Gaps to Address for Ecommerce

| Gap | Impact |
|-----|--------|
| No cart/checkout UI patterns exist | Need to design from scratch within brand language |
| No price prominence on cards | Ecommerce requires price as primary info hierarchy |
| No "Add to Cart" CTA anywhere | Current CTAs are informational ("find dealer", "book test ride") |
| No account/login UI | Needed for order tracking, saved bikes, purchase history |
| No urgency/scarcity patterns | Stock levels, "only 2 left at this store" |

---

## 2. Current User Journey (As-Is)

### Landing Page → Product Search → PDP → Store

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: LANDING PAGE                                                │
│                                                                     │
│ • Hero with seasonal campaign (e.g. cargo bike promotion)           │
│ • Category overview: e-Bike, Dreirad, Lastenrad                     │
│ • Sale highlights                                                   │
│ • Trust block (reviews, guarantees)                                 │
│ • Dealer locator CTA                                                │
│                                                                     │
│ Primary CTA: "Probefahrt vereinbaren" / "Händler finden"            │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: CATEGORY / PRODUCT LISTING (PLP)                            │
│                                                                     │
│ • Location selector: "Dein Standort: Düsseldorf"                    │
│ • Left sidebar filters:                                             │
│   - Sofort verfügbar (immediately available)                        │
│   - Kategorie (Trekking, City, MTB, S-Pedelec, Urban, Falt, etc.)  │
│   - Geschlecht (Gender)                                             │
│   - Marke (Brand)                                                   │
│   - Preis (Price)                                                   │
│   - Motor                                                           │
│   - Farbe (Color)                                                   │
│   - SALE toggle                                                     │
│ • Dynamically loaded product grid (async JS rendering)              │
│ • No visible sorting controls                                       │
│                                                                     │
│ Primary CTA: Click product card → PDP                               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: PRODUCT DETAIL PAGE (PDP)                                   │
│                                                                     │
│ • Product images (lifestyle + product shots)                        │
│ • Specs: motor, battery, frame type, brakes, gearing               │
│ • Price (UVP / sale price)                                          │
│ • Available sizes/colors                                            │
│ • Brand info                                                        │
│                                                                     │
│ Primary CTA: "Händler finden" / "Probefahrt vereinbaren"            │
│ ⚠️  NO "Add to Cart" — NO online purchase path                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: STORE FINDER                                                │
│                                                                     │
│ • Location input → "Finden" button                                  │
│ • Radius-based results: "Händler in deinem Umkreis"                 │
│ • Store cards (address, possibly hours)                             │
│ • No availability shown per store                                   │
│ • No appointment booking inline                                     │
│                                                                     │
│ Primary CTA: Visit store physically                                 │
│ ⚠️  JOURNEY ENDS — user must call/visit store                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Journey Friction Points

1. **Dead end at PDP** — no transactional action available; user is pushed offline
2. **No inventory visibility** — "Sofort verfügbar" filter exists but doesn't show which store has the bike
3. **Store finder is disconnected** — doesn't carry product context from PDP
4. **No appointment booking flow** — "Probefahrt vereinbaren" is a CTA but no scheduling UI observed
5. **No saved state** — user can't save bikes, compare, or return to a shortlist
6. **Location is set globally** — not tied to specific product availability per store

---

## 3. Transformation Plan: Static → Ecommerce

### Phase 0: Foundation (Months 1–2)

**Goal:** Lay technical groundwork without changing the customer-facing experience.

| Work Stream | Tasks |
|-------------|-------|
| **Inventory Service** | Build inventory aggregation layer across 100+ stores; define sync frequency (target: 15-min intervals); normalize stock data (SKU, size, color, store_id, qty) |
| **Customer Identity** | Implement Auth0; design account creation flow; SSO for existing franchise CRM contacts |
| **commercetools Setup** | Configure product types, categories, and pricing in commercetools; connect Akeneo product feed; set up multi-store inventory channels |
| **Store Data Model** | Enrich store records: operating hours, services offered, delivery radius, appointment slots, capacity |
| **Analytics Baseline** | Instrument current journey (GA4 / Segment) to establish pre-ecommerce conversion benchmarks |

### Phase 1: Discover & Reserve (Months 2–5)

**Goal:** Keep the "drive to store" model but add digital convenience. Lowest franchise resistance.

#### 1A. Enhanced PDP with Store Availability

```
┌──────────────────────────────────────────────────┐
│ PRODUCT DETAIL PAGE (enhanced)                   │
│                                                  │
│ [Image Gallery]     Brand / Model Name           │
│                     ★★★★★ (124 Bewertungen)      │
│                     €4,299  (UVP €4,799)         │
│                                                  │
│ Größe:  [S] [M] [L] [XL]                        │
│ Farbe:  ● ● ●                                   │
│                                                  │
│ ─── Verfügbarkeit in deiner Nähe ─────────────── │
│                                                  │
│ 📍 e-motion Düsseldorf    ✅ Sofort verfügbar    │
│    [Probefahrt buchen]  [Reservieren]            │
│                                                  │
│ 📍 e-motion Köln          ✅ 1 verfügbar         │
│    [Probefahrt buchen]  [Reservieren]            │
│                                                  │
│ 📍 e-motion Essen         ⏳ In 3-5 Tagen        │
│    [Benachrichtigen]                             │
│                                                  │
│ ─── Specs ────────────────────────────────────── │
│ Motor: Bosch Performance CX                      │
│ Akku: 750 Wh                                    │
│ ...                                              │
└──────────────────────────────────────────────────┘
```

**Key changes:**
- Real-time stock per nearby store on the PDP
- "Reservieren" button: holds bike 48h with optional €99–€199 deposit via Stripe
- "Probefahrt buchen" opens inline calendar picker (Calendly Enterprise or custom)
- "Benachrichtigen" for out-of-stock → email/SMS when available

#### 1B. Test Ride Booking Flow

```
User selects "Probefahrt buchen"
  → Choose store (pre-selected from PDP context)
  → Choose date/time (store's available slots)
  → Enter name, email, phone
  → Confirm
  → Email confirmation + calendar invite
  → Store dashboard receives booking + bike reservation
```

#### 1C. Reserve Online, Buy in Store

```
User selects "Reservieren"
  → Confirm size/color
  → Pay deposit (€99–€199) via Stripe
  → Bike held at store for 48h
  → User visits store, completes purchase
  → Deposit applied to final price
  → If not collected: auto-refund after 48h
```

**Technical requirements:**
- Stripe Connect (each store = connected account for deposit routing)
- Reservation service (state machine: reserved → collected → completed / expired → refunded)
- Store notification system (email + dashboard)
- Calendar/booking microservice

---

### Phase 2: Full Online Checkout (Months 5–9)

**Goal:** Enable complete purchase online with store fulfillment.

#### 2A. Cart & Checkout

| Component | Solution |
|-----------|----------|
| Cart | commercetools cart API; persistent across sessions |
| Checkout | Multi-step: Shipping → Payment → Review → Confirm |
| Payment | Stripe Connect (split: store gets product revenue, HQ gets platform fee) |
| Financing | Integration with financing partner (e.g. PayPal Ratenzahlung, Consors Finanz) |
| Leasing | JobRad / BusinessBike / Lease a Bike integration |

#### 2B. Order Management & Fulfillment

```
Order placed online
  → OMS (Fluent Commerce) routes to fulfilling store
  → Store receives order on dashboard
  → Store assembles bike (PDI — pre-delivery inspection)
  → Options:
      a) Customer pickup (click & collect)
      b) Local delivery (store's own delivery radius)
      c) Shipping via partner carrier (for outside delivery radius)
  → Tracking updates sent to customer
  → Delivery confirmed
```

**Routing logic:**
1. Prefer store with stock closest to customer
2. If no local stock: check stores within 100km
3. If no regional stock: route to central warehouse or allow store-to-store transfer
4. Customer always sees estimated delivery date before purchase

#### 2C. Checkout UX (within existing design language)

```
┌──────────────────────────────────────────────────┐
│ WARENKORB                                        │
│                                                  │
│ [img] Cube Kathmandu Hybrid ONE 750         1x   │
│       Größe: M | Farbe: flashgrey                │
│       Lieferung von: e-motion Düsseldorf         │
│       €4,299.00                                  │
│                                                  │
│ ─── Lieferoptionen ───────────────────────────── │
│                                                  │
│ ○ Abholung im Store (kostenlos)      2-3 Tage   │
│ ○ Lieferung nach Hause               €49   5-7T │
│ ● Express-Montage & Lieferung        €99   2-3T │
│                                                  │
│ ─── Zusammenfassung ──────────────────────────── │
│                                                  │
│ Zwischensumme:                      €4,299.00    │
│ Lieferung:                              €99.00   │
│ Gesamt:                             €4,398.00    │
│                                                  │
│ [Zur Kasse]           oder [Finanzierung ab €89/M]│
└──────────────────────────────────────────────────┘
```

#### 2D. Payment Methods

| Method | Priority | Rationale |
|--------|----------|-----------|
| Stripe (Cards) | Must have | Visa, Mastercard, Amex |
| PayPal | Must have | Dominant in German e-commerce |
| Klarna / Ratenkauf | Must have | Installments for €3k–€8k bikes |
| SEPA Lastschrift | Should have | German bank transfers |
| Apple Pay / Google Pay | Should have | Mobile checkout |
| JobRad / Leasing | Should have | B2B/employer benefit |

---

### Phase 3: Order Tracking & After-Sales (Months 8–12)

#### 3A. Order Tracking

```
┌──────────────────────────────────────────────────┐
│ MEINE BESTELLUNGEN                               │
│                                                  │
│ Bestellung #EM-2026-48291                        │
│ Cube Kathmandu Hybrid ONE 750                    │
│                                                  │
│ ✅ Bestellt                         02.06.2026   │
│ ✅ Bestätigt von e-motion Düsseldorf 02.06.2026  │
│ ✅ Montage abgeschlossen            04.06.2026   │
│ 🔄 Zur Auslieferung bereit          05.06.2026   │
│ ○  Zugestellt                                    │
│                                                  │
│ [Lieferung verfolgen]  [Store kontaktieren]      │
└──────────────────────────────────────────────────┘
```

**Status flow:**
`Ordered → Confirmed by Store → Assembly/PDI → Ready for Pickup/Dispatch → Out for Delivery → Delivered`

#### 3B. After-Sales Support

| Service | Implementation |
|---------|---------------|
| **Warranty claims** | Form submission → routed to original selling store |
| **Service booking** | Reuse appointment system from Phase 1 for workshop slots |
| **Accessories upsell** | Post-purchase email sequence (helmet, lock, bags — 7/14/30 days) |
| **First service reminder** | Automated at 6 weeks / 500km (connected via bike registration) |
| **Returns** | 14-day Widerrufsrecht; return to any store or pickup arranged |
| **Trade-in program** | Phase 3 — used bike valuation tool |

#### 3C. Customer Account ("Mein e-motion")

```
Mein e-motion
├── Meine Bestellungen (order history + tracking)
├── Meine Bikes (registered bikes, service history)
├── Meine Termine (upcoming test rides, service appointments)
├── Meine Wunschliste (saved/favorited bikes)
├── Mein Standort (preferred store, delivery address)
└── Einstellungen (profile, notifications, payment methods)
```

---

### Phase 4: Marketplace & Intelligence (Months 12–24)

| Initiative | Description |
|------------|-------------|
| **Used bike marketplace** | Stores list trade-ins; certified pre-owned program |
| **Dynamic redistribution** | If Store A has excess stock of a model that Store B needs, suggest transfer |
| **AI sales assistant** | Chat that recommends bikes based on use case, budget, terrain, body measurements |
| **Personalized search** | Algolia personalization based on browsing history, location, preferences |
| **Subscription services** | Monthly bike subscription (swap models seasonally) |
| **Insurance integration** | Offer theft/damage insurance at checkout |

---

## Technical Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  Landing │ PLP │ PDP │ Cart │ Checkout │ Account │ Store Finder  │
└────────────────────────────┬────────────────────────────────────┘
                             │ API Gateway
┌────────────────────────────┼────────────────────────────────────┐
│                    SERVICES LAYER                                │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Product  │  │Inventory │  │ Booking  │  │  Order   │       │
│  │ Service  │  │ Service  │  │ Service  │  │Management│       │
│  │(Akeneo + │  │(Aggregate│  │(Calendar │  │ (Fluent  │       │
│  │commercet)│  │ 100+ str)│  │ + slots) │  │Commerce) │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Payment  │  │ Customer │  │  Search  │  │  CMS     │       │
│  │ (Stripe  │  │ Identity │  │(Algolia) │  │(Content- │       │
│  │ Connect) │  │ (Auth0)  │  │          │  │  ful)    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐         │
│  │         CUSTOM BUILD (20%)                         │         │
│  │  • Franchise commission engine                     │         │
│  │  • Inventory federation & sync                     │         │
│  │  • Lead routing & attribution                      │         │
│  │  • Store dashboard & notifications                 │         │
│  │  • Reservation state machine                       │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Success Metrics by Phase

| Phase | Primary Metric | Target |
|-------|---------------|--------|
| 1 | Lead-to-Test-Ride Conversion Rate | +40% vs current |
| 1 | Online reservations per month | 500+ within 3 months of launch |
| 2 | Online checkout completion rate | >2.5% of PDP visitors |
| 2 | Average order value (online) | Within 5% of in-store AOV |
| 3 | Customer satisfaction (post-purchase NPS) | >60 |
| 3 | Repeat service booking rate | >30% within 12 months |
| 4 | Used bike GMV | €2M+ annual |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Franchise resistance to online sales | Start with Reserve (drives footfall); commission engine ensures stores earn on every online sale |
| Inventory data quality across 100+ stores | Gradual rollout; start with 10 pilot stores; validate sync before scaling |
| Cannibalizing in-store margins | Price parity policy; online orders fulfilled by stores (they keep the margin) |
| Assembly quality for shipped bikes | Mandatory PDI checklist in OMS; delivery partner trained for bike handling |
| Returns complexity (€3k–€8k items) | Return to any store policy; inspection at store before refund |
| Payment splitting complexity | Stripe Connect handles multi-party payments; clear SLA on store payouts |

---

## POC Implementation Status

### What's Been Built (Click Dummy)

This repository contains a working Next.js POC deployed to Vercel. All data is mocked — no integrations.

| Page | Route | Status |
|------|-------|--------|
| Homepage | `/` | ✅ Hero, trust bar, categories, featured bikes, sale section |
| Product Listing (PLP) | `/bikes` | ✅ Filterable grid (category, brand, sale, sort) |
| Product Detail (PDP) | `/bikes/[slug]` | ✅ Images, specs, size/color selector, store availability, add to cart |
| Cart | `/cart` | ✅ Items, fulfillment toggle (delivery/pickup), order summary |
| Checkout | `/checkout` | ✅ 3-step: Shipping → Payment (card/PayPal/Klarna/SEPA) → Review |
| Order Tracking | `/orders` | ✅ Status timeline, delivery info, success confirmation |
| Store Finder | `/stores` | ✅ All stores with inventory stats, hours, services |
| After-Sales Account | `/account` | ✅ Tabbed portal (see below) |

### After-Sales Portal (`/account`) Tabs

| Tab | Content |
|-----|---------|
| Bestellungen | Order cards with progress bar, link to full tracking |
| Zahlung | Saved payment methods, active Klarna installment plan |
| Mein Store | Preferred pickup store selector (8 stores) |
| Reparaturen & Upgrades | Service history + 4 upgrade packages with pricing |
| Wartung | Active maintenance plan (€29.90/mo), km-based service schedule, upsell options |

### Mock Data Scope

- 12 real-brand e-bikes (€3,799–€7,499 price range)
- 8 German stores with realistic addresses and opening hours
- 60+ inventory entries (size × color × store combinations)
- Pre-seeded demo order, repair history, maintenance plan

### What's NOT in the POC

- No authentication (account page is open)
- No persistent state (cart/orders reset on page reload)
- No real payments or booking confirmations
- No search (Algolia would be added in production)
- No i18n (German only, hardcoded)
- No CMS integration (all content is static)

### Next Steps for POC Enhancement

1. **Persistent state** — localStorage or Zustand for cart/orders across sessions
2. **Search** — basic client-side search or Algolia InstantSearch for demo
3. **Animations** — Framer Motion for page transitions and micro-interactions
4. **Real product images** — replace Unsplash with actual e-bike product photography
5. **Responsive audit** — thorough mobile testing across breakpoints
6. **Vercel deployment** — connect repo, set up preview deployments per branch
