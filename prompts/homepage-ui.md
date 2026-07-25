# Homepage UI Implementation

## Goal

Replace the current design-system showcase page (`app/page.tsx`) with the production homepage matching the attached UI reference exactly. Move the design-system page to `app/design-system/page.tsx` so it remains accessible.

## Skills read

- `AGENTS.md` — architecture, tech stack, rules
- Existing UI components inspected: `button.tsx`, `chip.tsx`, `bias-meter.tsx`, `news-card.tsx`
- `globals.css` — design tokens

## Existing code inspected

- `app/page.tsx` — current design-system showcase (will be moved)
- `app/layout.tsx` — Poppins font, root layout
- `components/ui/news-card.tsx` — needs modifications to match reference
- `components/ui/chip.tsx` — usable as-is for category bar
- `components/ui/bias-meter.tsx` — the homepage card uses an inline bias bar, not the full meter

## Decisions

- The homepage uses **static mock data** (12 news cards with realistic placeholder content) — no Supabase queries yet. Data will come from a `lib/mock-data.ts` file.
- The existing `NewsCard` component needs refactoring to match the reference card layout (info icon overlay, no description, source count instead of read time, inline bias bar instead of pills).
- The design-system page moves to `/design-system` to remain accessible.
- All new components are server components (no `"use client"`) unless interactivity is needed.
- The category chip bar needs horizontal scrolling with left/right arrow buttons — this requires `"use client"`.

## Files to change

### New files
- `app/page.tsx` — homepage (server component)
- `app/design-system/page.tsx` — moved design-system showcase
- `components/layout/header.tsx` — top navbar (server component)
- `components/layout/footer.tsx` — site footer (server component)
- `components/layout/category-bar.tsx` — scrollable chip bar (`"use client"`)
- `components/ui/home-news-card.tsx` — homepage-specific card variant
- `lib/mock-data.ts` — static article data for 12 cards

### Modified files
- `next.config.ts` — allow placeholder image domains if needed

### Preserved files (no changes)
- `components/ui/button.tsx`
- `components/ui/chip.tsx`
- `components/ui/bias-meter.tsx`
- `components/ui/news-card.tsx` (keep for detail page use later)

## Implementation requirements

### 1. Header (`components/layout/header.tsx`)

From the reference (top bar):

**Top utility bar** (thin dark background `#0D0D0F`):
- Left: "Browser Extension" link
- Left-center: "Theme:" Light | Dark | Auto toggle text
- Right: "Monday, June 1, 2026" date
- Right: "Set Location" link
- Right: "International Edition" badge

**Main navbar** (white background, border-bottom):
- Left: Hamburger menu icon
- Left: "biasly" logo (bold) + "News" (small, below)
- Center: Nav links — Home, For You, Local, Blindspot
- Right: "Subscribe" button (solid dark) + "Login" button (outlined)

### 2. Category Bar (`components/layout/category-bar.tsx`)

- Horizontal scrollable row of Chip components
- Left arrow and right arrow buttons on each end
- Chips: World Cup, IPL, Social Media, Business & Markets, Health & Medicine, Soccer, Artificial Intelligence, Arsenal FC, Extreme Weather and Disasters
- Each chip has a "+" icon
- Sits below the header, separated by a thin border

### 3. News Card — Homepage variant (`components/ui/home-news-card.tsx`)

Each card in the reference shows:
- **Image**: Full-width, aspect-ratio ~16/10, rounded corners (top)
- **Info icon**: circle overlaid top-right of image
- **Category and Location**: small text below image (e.g., "Politics · United States")
- **Title**: Bold, 2-line clamp, ~15px font
- **Bias inline bar**: A compact row with:
  - Left: `L XX%` in a small red rounded pill
  - Center: `Center XX%` as plain text in the middle
  - Right: `Right XX%` in a small blue rounded pill
- **Source count**: "XX sources" — small gray text at bottom

### 4. Homepage layout (`app/page.tsx`)

- Header component
- Category bar component
- `<main>` with max-width 1280px, centered, padding
- "Top News" heading
- 3-column grid of 12 HomeNewsCard components
- Grid gap: 24px
- Footer component
- Responsive: 3 cols desktop, 2 tablet, 1 mobile

### 5. Footer (`components/layout/footer.tsx`)

Dark footer:
- Background: `#0D0D0F`
- 4-column layout:
  - Col 1: "biasly News" logo + tagline
  - Col 2: "Company" — About, Careers, Press, Contact
  - Col 3: "Help" — Help Center, Guides, Privacy Policy, Terms of Service
  - Col 4: "Connect" — social icons (X, LinkedIn, Instagram, YouTube)
- Bottom bar: copyright text

### 6. Mock Data (`lib/mock-data.ts`)

12 article objects matching the reference cards with category, location, title, left/center/right percentages, source count, and image path.

### 7. Generated images

Generate 12 news-appropriate images stored in `public/images/`.

## Acceptance criteria

1. Homepage renders at `/` with all 12 cards in a 3-column grid
2. Header displays correctly with logo, nav links, subscribe/login buttons, and utility bar
3. Category bar scrolls horizontally with arrow buttons
4. Each card shows image, info icon, category/location, title, compact bias bar, source count
5. Footer renders with 4 columns and copyright
6. Design-system page is accessible at `/design-system`
7. Page compiles without errors
8. Responsive: 3 to 2 to 1 column grid on resize

## Checks to run

- `npm run dev` — verify no compilation errors
- Browser screenshot at `localhost:3000` — visual match to reference

## Manual test steps

1. Run `npm run dev`
2. Open `http://localhost:3000` — see homepage with header, category bar, 12 news cards, footer
3. Scroll down to verify all 4 rows render
4. Open `http://localhost:3000/design-system` — old design-system page still works
