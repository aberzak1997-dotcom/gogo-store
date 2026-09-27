# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Broad Moroccan tech buyers: anyone in Morocco shopping online for tech accessories and electronics for everyday use, work, or gaming. They are typically comparing against Jumia, Electroplanet, and ordering direct from AliExpress, and they want the right item at a fair price, delivered in Morocco, with a way to pay they trust.

A second audience is the store operator (admin), who runs catalog, orders, inventory, discounts, reviews, payments, shipping, SEO, and marketing from the `/admin` back office.

## Product Purpose

WIVITEC ("Technology. Elevated.") is an online store at wivitec.com selling tech accessories and electronics: keyboards, mice, headsets, webcams, chargers and cables, storage, gaming accessories, and laptop accessories. Success means Moroccan shoppers find what they need, trust the store enough to complete checkout, and come back.

## Positioning

Price, convenience, and trust for Moroccan buyers: a local storefront with Moroccan delivery and cash on delivery, carrying accessories that would otherwise mean a slow, uncertain AliExpress order or a narrower big-box selection.

## Operating Context

- Shoppers browse the catalog, category and filter pages, deals, new arrivals, and best sellers, then use a full-page cart (`/cart`) and checkout.
- Customer accounts include registration with email confirmation, order history, and order tracking.
- Products are supplied through CJ Dropshipping (`api/cj-proxy.ts`, `src/lib/cj-api.ts`, admin CJ page).
- The operator manages the store through the admin area. Support email is support@wivitec.com.

## Capabilities and Constraints

- Stack: React + TypeScript + Vite SPA, Tailwind, shadcn/ui, Supabase (data + auth), deployed on Vercel. Routes live in `src/App.tsx` (see `AI_RULES.md`).
- Payments: Stripe (via Supabase edge function), PayPal, cash on delivery, and bank transfer. Which methods are active is set in admin settings.
- **Currency:** prices will be in Moroccan dirham (MAD) going forward. The code currently defaults to USD (`StoreContext`, PayPal provider, cart `$` formatting), so this is a planned migration and not yet done.
- **Languages:** English only today. French and Arabic (with RTL) are planned for later. An earlier i18n attempt was reverted, so layouts should not assume English-only text lengths or LTR forever.
- Open: the contact form currently saves only to the visitor's localStorage, so no admin sees messages yet.
- Unverified service claims appear in the UI: free shipping over $50, 30-day returns, 1-year warranty, and 24h dispatch. Their actual terms under a dropshipping model are not confirmed.

## Brand Commitments

- Name: WIVITEC (uppercase). Tagline: "Technology. Elevated."
- Logo component: `src/components/Logo.jsx`.

## Evidence on Hand

- Real product catalog data comes from Supabase/CJ.
- **No real social proof exists yet.** The About-page stats (10k+ customers, 500+ products, 50+ countries) and the homepage testimonials (Sarah M., James K., Amira B.) are placeholders. Future work must not display invented customer counts, reach figures, reviews, or testimonials. Use real product reviews from the store's review system once they exist, or omit the section.
- Stock photography (Unsplash/Pexels) is used in promo panels. There is no owned product or lifestyle photography beyond `public/hero-product.png`.

## Product Principles

1. **Earn trust honestly.** For a young store, credibility comes from clear prices, visible payment options (especially cash on delivery), and plain delivery and return terms, never from fabricated proof.
2. **Local first.** Design for Moroccan buyers: MAD pricing, Moroccan delivery realities, and room for French and Arabic.
3. **Get shoppers to the right product fast.** Categories, search, and filters matter more than spectacle for a broad audience.
4. **Checkout is the product.** Every friction point between cart and confirmed order costs a sale. Keep checkout clear, reassuring, and resilient.

## Accessibility & Inclusion

Future Arabic support requires RTL-ready layouts. No other formal standard has been established.
