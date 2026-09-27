# WIVITEC Store — Session Summary

**Project:** React + TypeScript + Vite + Tailwind SPA
**Path:** `C:\Users\hp\dyad-apps\WIVITEC`
**Backend:** Supabase project `epfawojrdncmmjcqafse` · Deployed on Vercel at wivitec.com
**Brand palette:** `#0E121A` dark, `#1160CB` interactive blue, `#1528A1` navy, `#479BF7` accent, `#EEF4FF` light surface, `#FF7A30` orange, `#0C0D10` rich black, `#c5c5c5` light-grey border
**Font:** Inter only (weights 300–800, Google Fonts)

---

## Git history (most recent first)

| Commit | Feature |
|--------|---------|
| `904c890` | Revert multilingual support (user undid the i18n work) |
| `087bcb7` | ~~feat: full EN/FR/AR i18n with RTL~~ (reverted) |
| `f06f414` | feat: large hero section above existing homepage hero |
| `d4a69b4` | feat: email confirmation flow |
| `291deac` | fix: customer login fails after registration |
| `cfc64f9` | fix: always show active payment methods in checkout |
| `cc8b9cd` | feat: convert cart from sidebar drawer to full `/cart` page |
| `81a4e60` | fix: wire CartDrawer to header cart icon |

> **All the large-hero three-panel redesign work below is UNCOMMITTED.** Run `git status` and commit when satisfied.

---

## Earlier features (committed)

### Cart → full page (`/cart`)
- `CartPage.tsx` — two-column layout (items left, sticky summary right). Header cart icon = `<Link to="/cart">`. `CartDrawer.tsx` is now unused dead code.

### Checkout payment methods always visible
- `StoreContext` exposes `settingsLoaded: boolean` (false until Supabase responds); initial state also merges `localStorage("payment_config")`. CheckoutPage shows skeleton pills while `!settingsLoaded`.

### Customer auth + email confirmation
- `CustomerAuthContext.customerRegister` returns `needsEmailConfirmation: true` when `signUp()` returns no session (no fake-login). `emailRedirectTo` → `/account/confirmed`.
- `ConfirmEmailPage.tsx` ("check inbox" + resend), `EmailConfirmedPage.tsx` (verify spinner → success 5s countdown → `/account`, or error).
- **Supabase dashboard TODO:** add `https://wivitec.com/account/confirmed` to Auth → URL Configuration → Redirect URLs.

---

## Large Hero — three-panel layout (HomePage.tsx, UNCOMMITTED)

A full section (`min-h-[70vh]`, `bg-slate-50/60`, `p-[10px]`) sitting ABOVE the original compact promo hero. Three horizontal panels, all `mx-[5px] mb-[5px]`, `rounded-[15px]`:

### LEFT panel — "New Arrival" (`group w-[72px] hover:w-[280px]`)
- Collapsed: **orange `#FF7A30`** bg, vertical white label (`-rotate-90`, 18px semibold), `border border-[#c5c5c5]`
- Hover: light-blue `#EEF4FF` overlay fades in (`z-[1]`), content on `z-[2]`
- Content: full-cover product image (top 52%) + brand + title + description + price + **orange** "Check Product →" pill + transparent-bordered "Check Other New Arrivals" button → `/new-arrivals`
- `onMouseEnter/Leave` → `setSideOpen(true/false)`

### CENTER panel — main hero (text LEFT + image RIGHT)
- CSS mesh-gradient bg (brand-blue radial glows + dot grid overlay) — NOT an external SVG (user rejected `/public/hero-bg.svg`)
- Left: "POWER YOUR" (slate-900) + "DIGITAL WORLD" (blue gradient text), 15px subtitle, "Shop Now" gradient pill + "View Deals" outline button — all left-aligned (`items-start text-left`)
- Right: **hero image absolutely positioned** `top-0 right-0 bottom-0 w-[45%]`, `object-cover` (fills full panel height). Hides when `sideOpen` (`opacity-0 scale-95`).
- **Current image:** `/hero-product.png` (Sony VR headset, white bg) — copied from `Downloads/hero image (2).png`. (Earlier tried JBL `.png` and Sony `.jpg`.)

### RIGHT panel — "Best Seller" (`group w-[72px] hover:w-[280px]`)
- Blue gradient bg (`#1160CB → #1528A1`), white vertical label
- Hover: scrollable list of top 5 best sellers; each card = full-width image on top + name/price below (`bg-white/15`), links to `/product/[id]`
- **Mouse-position auto-scroll:** `requestAnimationFrame` loop — mouse in top 35% scrolls up, bottom 35% down, middle stops. Handlers `startScrollLoop`/`stopScrollLoop`/`handlePanelMouseMove`; refs `panelScrollRef`, `scrollSpeedRef`, `animFrameRef`
- `onMouseEnter/Leave` → `setSideOpen` + scroll loop

### State
- `const [sideOpen, setSideOpen] = useState(false)` — hides center hero image when either side panel is open

---

## Other tweaks (UNCOMMITTED)

- **Announcement bar** text → `font-normal`
- **Nav links** (Shop/Deals/About/Contact/Categories) → `font-normal`, solid `text-[#0C0D10]`
- **Feature strip icons** (Free shipping etc.) → circular blue-gradient w/ white icons; labels `font-semibold text-[#0C0D10]`
- **Promo Campaign section** + **Premium Collection promo section** → `px-[20px]` (was `px-4 md:px-6`)

---

## ⚠️ PENDING (last request, not done)

**"give these items 15 px border radius"** — applies to the promo hero cards in the second hero section (HomePage.tsx ~line 480–600):
- Premium Collection dark panel (`flex-[2]`, currently `rounded-none bg-[#0d1b2e]`)
- Featured Deal blue panel (`flex-[1]`, `rounded-none bg-[#1528A1]`)
- Gaming Essentials + Work Setup promo cards (`group … rounded-none min-h-[340px]`)

**TODO:** change each `rounded-none` → `rounded-[15px]` on those 4 promo cards.

---

## Older pending task (still open)

**Contact form messages go nowhere** — `ContactPage` saves only to customer's own `localStorage("contact_messages")`. No admin sees them. Fix: Supabase `contact_messages` table + ContactPage write + admin inbox page.

---

## Key files
- `src/pages/storefront/HomePage.tsx` — three-panel large hero + promo cards (active work area)
- `src/pages/storefront/CartPage.tsx` — full cart page
- `src/pages/storefront/CheckoutPage.tsx` — payment skeleton loading
- `src/pages/storefront/ConfirmEmailPage.tsx` / `EmailConfirmedPage.tsx`
- `src/context/StoreContext.tsx` — `settingsLoaded`, payment_config merge
- `src/context/CustomerAuthContext.tsx` — `needsEmailConfirmation`, `emailRedirectTo`
- `src/components/layout/Header.tsx` — nav, cart link, feature strip
- `public/hero-product.png` — current center hero image (Sony VR)
- `public/hero-bg.svg`, `public/hero-product.jpg` — copied in but UNUSED
