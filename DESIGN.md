---
name: WIVITEC
description: Technology. Elevated. A bright, trustworthy tech storefront for Moroccan shoppers.
colors:
  interactive-blue: "#1160CB"
  deep-navy: "#1528A1"
  sky-blue: "#479BF7"
  ember-orange: "#FF7A30"
  ink: "#0C0D10"
  night: "#0E121A"
  night-card: "#16181C"
  canvas: "#FFFFFF"
  counter-grey: "#F0F2F8"
  mist-blue: "#EEF4FF"
  hover-lavender: "#E8EBFC"
  success-green: "#05B169"
  error-red: "#CF202F"
  warning-amber: "#CA8A04"
  rating-gold: "#FFCC00"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(36px, 4.5vw, 54px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(28px, 4vw, 40px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(24px, 3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  card-title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  price:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "'tnum'"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "3px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.interactive-blue}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.canvas}"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  button-on-dark:
    backgroundColor: "rgba(255,255,255,0.10)"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  button-icon-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "40px"
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px"
  product-plate:
    backgroundColor: "{colors.counter-grey}"
    rounded: "{rounded.md}"
    padding: "16px"
  content-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px"
  search-input:
    backgroundColor: "{colors.counter-grey}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 36px"
    height: "40px"
  eyebrow-chip:
    backgroundColor: "rgba(17,96,203,0.06)"
    textColor: "{colors.interactive-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  announcement-bar:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    padding: "8px 16px"
  promo-panel-dark:
    backgroundColor: "{colors.night}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "40px"
---

# Design System: WIVITEC

## Overview

**Creative North Star: "The Clean Counter"**

WIVITEC should feel like a bright, well-lit tech shop where everything sits on a clean counter and the staff are easy to find. The page is white with a pale blue-grey counter surface (`counter-grey`). Products sit on soft plates of that grey, shown whole and uncropped, so the shopper sees exactly what they are buying. One confident blue (`interactive-blue`) marks every place you can act, and deep navy carries prices, emphasis and the occasional full-width band. Trust comes from clarity and calm, not spectacle.

The form language is soft and friendly: pill-shaped buttons, chips and search, generously rounded cards (16px), and circular icon plates. Depth is gentle and blue-tinted. Cards rest on a faint navy haze and rise slightly on hover, so the surface feels touchable without shouting. Density is moderate. Product grids are compact enough for a broad audience to scan quickly, and sections breathe at 80px.

Energy is carried by accents, not by the base. Ember orange appears only for "new" moments, and dark `night` promo panels with photography break up the white rhythm on the homepage. Everything else stays quiet so products and prices lead.

**Key Characteristics:**
- White canvas and `counter-grey` (#F0F2F8) surfaces. There is no beige or warm neutral.
- One action blue (#1160CB). Hover deepens to navy (#1528A1). Sky blue (#479BF7) is for highlights, not actions.
- Pill actions, 16px cards, circular icon plates.
- Navy-tinted shadows (rgba(21,40,161,…)), never grey-black on light surfaces.
- Inter throughout. Small uppercase labels are widely tracked (3px) for a precise, technical note.

> **Implementation note for agents.** Tokens live in `src/index.css` (loaded by `src/main.tsx`) and `tailwind.config.ts`. Tailwind's `primary` resolves to Interactive Blue, and `.text-caption` implements the Label style. Prefer these over repeating literal hex values in new code.

## Colors

A single bright blue on white and cool grey, grounded by navy and ink, with one warm spark.

### Primary
- **Interactive Blue** (#1160CB): The action color. Primary buttons, links, active nav, cart badge, focus rings, icons in category tiles, brand eyebrows on product cards.
- **Deep Navy** (#1528A1): The weight behind the blue. Prices, the hover state of primary buttons, announcement bar, full-width deal bands, avatar plates.

### Secondary
- **Sky Blue** (#479BF7): Highlights and states. Product-card hover border, info toasts, scrollbar hover. Not a button fill at rest.

### Tertiary
- **Ember Orange** (#FF7A30): Reserved for "New Arrival" moments (the homepage side panel and its CTA). Rare by design.

### Neutral
- **Ink** (#0C0D10): All primary text and headings. Secondary text uses ink at reduced opacity (60% supporting, 50% descriptions, 40% meta, 30% placeholders and quiet labels).
- **Canvas** (#FFFFFF): Page floor, cards, dropdowns.
- **Counter Grey** (#F0F2F8): Alternate page background (About, account pages), product image plates, search field fill, card hairlines and dividers.
- **Mist Blue** (#EEF4FF): Pale blue wash for highlighted panels and hero backgrounds.
- **Hover Lavender** (#E8EBFC): Hover fill on grey tiles.
- **Night** (#0E121A) / **Night Card** (#16181C): Dark promo panels and CTA banners, and the elevated card inside them.

### Semantic
- **Success Green** (#05B169), **Error Red** (#CF202F), **Warning Amber** (#CA8A04): Toast accents, savings text, validation. Text and thin borders only, never large fills.
- **Rating Gold** (#FFCC00): Star ratings only.

### Named Rules
**The One Blue Voice Rule.** Interactive Blue is the only color that says "click me." Don't introduce another blue for actions (no stock Tailwind `blue-*` or shadcn defaults).

**The Rare Ember Rule.** Orange marks newness and nothing else. If more than one orange element is visible in a viewport, one of them is wrong.

## Typography

**Display Font:** Inter (with -apple-system, Segoe UI, sans-serif)
**Body Font:** Inter
**Label Font:** Inter, uppercase and tracked

**Character:** One neutral, highly legible family carries everything. Personality comes from weight contrast (700 headlines against 400 body) and from the widely tracked 11px uppercase labels that give the store its precise, technical accent.

### Hierarchy
- **Display** (700, clamp(36px→54px), 1.1, tight tracking): Homepage hero headline only, sometimes uppercase.
- **Headline** (700, clamp(28px→40px), 1.15, -0.5px): Page titles (About, Cart, Checkout).
- **Title** (600, 24→30px, 1.2): Section headings ("New Arrivals", "Best Sellers").
- **Card Title** (600, 15px): Product names, one line, clamped.
- **Body** (400, 15px, 1.6): Running text and descriptions. Cap at about 65ch (max-w-xl).
- **Body Small** (500, 13px): Dropdown items, buttons, search, meta.
- **Price** (700, 18px, navy, tabular figures): Every price. Compare-at prices sit beside it at 12px, ink 25%, struck through.
- **Label** (500, 11px, 3px tracking, uppercase): Eyebrows, brand names on cards, discount chips, announcement bar (2px tracking there).

### Named Rules
**The Tracked Label Rule.** Every eyebrow and brand tag is 11px uppercase with 3px tracking in Interactive Blue (or ink at 30–40% when quiet). Don't substitute bold or larger type for a label.

**The Readable Floor Rule.** Nothing a shopper must read goes below 11px. The 9–10px sizes currently used for badges and panel copy are drift.

## Layout

- **Container:** `section-container`, max 1280px centered, 24px side padding (32px from 1024px). Homepage promo rows use a 1400px max with 20px gutters.
- **Section rhythm:** 80px vertical padding between homepage sections; 40px top padding on inner pages.
- **Product grids:** 1 → 2 (640px) → 4 (1024px) columns with 16px gaps. The featured and search-results grid uses 3 columns at desktop.
- **Content cards:** 24px gaps, 28–32px internal padding.
- **Category tiles:** 4 columns on mobile, 8 on desktop, 12px gaps.
- **Header:** 68px sticky bar on translucent white with a hairline bottom border. A 32px navy announcement bar sits above it from 768px up.
- **Breakpoints:** Tailwind defaults (640 / 768 / 1024 / 1280). The nav collapses to a full-screen sheet below 1024px, and the homepage side panels hide below 768px.
- **RTL readiness:** Arabic is planned (see PRODUCT.md). Prefer logical spacing (`ps-`/`pe-`, `start`/`end`) in new layouts.

## Elevation & Depth

The system is layered, with a soft navy haze rather than grey shadows. Surfaces are mostly white on white or white on counter-grey, separated by 1px counter-grey hairlines. Shadows are low-opacity and navy-tinted so they read as cool light, not dirt. Interactive cards respond to hover by rising 4px, deepening the haze, and swapping the hairline for sky blue.

### Shadow Vocabulary
- **Rest haze** (`0 4px 24px rgba(21,40,161,0.06)`): Product cards at rest.
- **Quiet haze** (`0 2px 12px rgba(21,40,161,0.05)`): Static content cards (About, account).
- **Lift haze** (`0 8px 32px rgba(21,40,161,0.14)`): Hovered product cards.
- **Menu shadow** (Tailwind `shadow-md`/`shadow-lg`): Dropdowns and search suggestions only.

### Named Rules
**The Navy Haze Rule.** On light surfaces, shadows are tinted rgba(21,40,161,…) and stay at or below 0.16 opacity. Grey-black shadows belong only on dark panels.

## Shapes

Soft and friendly. Anything you press is a pill: primary and secondary buttons, chips, badges, search. Containers are generously rounded at 16px, with product image plates inset at 12px. Icon plates and avatars are full circles. Small utility controls (icon buttons, dropdown menus and their items) keep a tighter 8px/6px so they stay compact. There are no sharp corners on customer-facing surfaces. The `rounded-none` skeletons and promo cards on the homepage are drift.

## Components

### Buttons
Friendly pills with one clear voice.
- **Shape:** Full pill (9999px), 44px tall (40px compact), 24px horizontal padding, 13–14px semibold.
- **Primary:** Interactive Blue fill, white text. Hover deepens to Deep Navy over 200ms.
- **Outline:** White fill, 1px navy border, navy text. Hover adds a faint blue wash.
- **On dark:** 10% white fill, white text, 10% white border. Hover goes to 20%.
- **Icon ghost:** 40px square, 8px radius, ink at 60%. Hover turns text blue with a counter-grey fill.
- **Focus:** 2px Interactive Blue ring with 2px offset.
- **Disabled:** 40% opacity, no hover.

### Chips / Badges
- **Eyebrow chip:** Pill, 6% blue wash, blue tracked label, optional 10% blue border.
- **Discount chip:** Same recipe, reading "20% OFF", pinned top-left of the product plate.
- **Out of stock:** Ink pill, white label.
- **Count badge:** 16px blue circle, 9px bold white numerals, on the cart and wishlist icons.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Canvas on a white or counter-grey page. Night for dark promo panels.
- **Shadow Strategy:** Rest haze, then lift haze on hover (see Elevation).
- **Border:** 1px counter-grey. Sky blue on hover for interactive cards.
- **Internal Padding:** 28–32px for content cards, 12px for product cards (the plate carries its own 16px).

### Product Card (signature)
The heart of the store. A white card holds an inset counter-grey **plate** (12px radius, 5:4 aspect) with the product image contain-fitted and centered, never cropped. The image scales to 1.05 on hover. Below the plate: a blue tracked brand label and a gold star rating on one line, a one-line product name that turns navy on hover, a hairline, then a navy 18px price with an optional struck compare-at price, and a full-width primary Add to Cart pill. A wishlist heart in a white circle fades in top-right on hover.

### Inputs / Fields
- **Style:** Counter-grey fill, 1px counter-grey border, ink text, placeholder at ink 30%. Search is a pill with a leading 15px search icon. Form fields use 12px radius and 44–48px height.
- **Focus:** Border and 1px ring in Interactive Blue.
- **Error:** Error-red border and helper text.

### Navigation
- **Header:** 68px sticky, white at 95% with backdrop blur, hairline bottom. Logo left, then 15px regular links in ink, turning blue on hover or active, then a Categories dropdown, pill search, cart, account and a "Get Started" primary pill.
- **Dropdowns:** White, 8px radius, `shadow-md`. Items are 13px medium ink at 60% with a blue icon, and get a counter-grey hover fill with blue text.
- **Mobile:** Full-screen white sheet with a large search, tracked section labels, a 2-column grey category tile grid, and a full-width primary CTA pinned at the bottom.
- **Announcement bar:** Navy, 11px uppercase white text with 2px tracking, hidden below 768px.

### Homepage Hero Panels (signature)
A three-panel hero on a mist-blue wash. The center panel holds the headline, and two 72px side rails (ember "New Arrival" and blue-gradient "Best Seller") expand to 280px on hover to reveal products. Below it sit 16px-radius promo panels with photography under a dark gradient, white copy, and on-dark pill buttons.

## Do's and Don'ts

### Do:
- **Do** use Interactive Blue (#1160CB) for every primary action and Deep Navy (#1528A1) for its hover and for prices.
- **Do** make pressable things pills (9999px) and containers 16px.
- **Do** present products contain-fitted on a counter-grey (#F0F2F8) plate so the whole item is visible.
- **Do** tint shadows navy (rgba(21,40,161,…)) and keep them soft.
- **Do** set eyebrows and brand tags as 11px uppercase with 3px tracking.
- **Do** reach for the `primary` Tailwind color and `.text-caption` in new code instead of repeating literal hex values.

### Don't:
- **Don't** add a second action color. Sky blue is for highlights, and ember orange is only for "new".
- **Don't** use semantic green, red or amber as large fills or button backgrounds.
- **Don't** use sharp (0px) corners on customer-facing cards, skeletons or promo panels.
- **Don't** set readable text below 11px.
- **Don't** use grey-black drop shadows on light surfaces.
