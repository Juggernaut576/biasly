# Design System Implementation

## Goal

Implement the biasly design system as a foundational layer for the entire app. This includes the Tailwind v4 theme configuration (`globals.css`), the font setup in `layout.tsx`, and reusable design tokens that every future component will consume. No UI components or pages are built yet — this is purely the design infrastructure.

## Skills read

- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` — Next.js font loading with `next/font/google`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` — Font module API

## Existing code inspected

- `app/layout.tsx` — currently loads Geist/Geist_Mono, needs switch to Poppins
- `app/globals.css` — currently has basic Tailwind v4 `@import "tailwindcss"` with minimal theme, needs full design system tokens
- `app/page.tsx` — minimal placeholder, untouched in this task
- `package.json` — Next 16.2, React 19.2, Tailwind v4, PostCSS
- `postcss.config.mjs` — `@tailwindcss/postcss` plugin, no changes needed

## Decisions and assumptions

1. **Poppins is not a variable font** — must specify explicit weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold) per the type scale.
2. **Tailwind v4 theming** — uses the new `@theme inline {}` block for CSS variables instead of `tailwind.config.js`. All design tokens go here.
3. **Dark mode is NOT in the design reference** — the UI reference shows a light-only design system. Remove the `prefers-color-scheme: dark` media query. We can add dark mode later if needed.
4. **No component files yet** — this prompt creates only the token layer. Components (buttons, cards, chips, bias meter) will be separate tasks.
5. **Icon library** — the reference shows Lucide-style icons (line, 2px stroke, rounded caps). We will install `lucide-react` as the icon package.

## Files to change

| File | Action |
|---|---|
| `app/layout.tsx` | MODIFY — replace Geist with Poppins, update metadata to biasly branding |
| `app/globals.css` | MODIFY — full design system tokens via Tailwind v4 `@theme inline` |

## Implementation requirements

### 1. Font setup — `app/layout.tsx`

- Remove `Geist` and `Geist_Mono` imports.
- Import `Poppins` from `next/font/google`.
- Load weights `400`, `500`, `600`, `700` with `subsets: ["latin"]` and `display: "swap"`.
- Assign the CSS variable `--font-poppins` via the `variable` option.
- Apply `poppins.variable` to the `<html>` element's `className`.
- Keep `antialiased`, `h-full` on `<html>`.
- Keep `min-h-full flex flex-col` on `<body>`.
- Update `metadata` to:
  - `title`: `"biasly — Balanced news coverage, powered by AI."`
  - `description`: `"AI-powered news analysis with sentiment and political framing insights."`

### 2. Design tokens — `app/globals.css`

Replace the entire file contents with the complete design system. All values extracted from the UI reference image:

#### Colors (as CSS custom properties in `:root`, mapped into `@theme inline`)

**Primary text**
- `--text-primary`: `#0D0D0F`
- `--text-secondary`: `#6B7280`
- `--surface`: `#F6F6F6`

**Semantic (bias colors)**
- `--left-bias`: `#B42318`
- `--center-bias`: `#6E6E7B`
- `--right-bias`: `#1D4ED8`

**Neutrals / backgrounds**
- `--bg-primary`: `#FFFFFF`
- `--bg-secondary`: `#F0F0F0`
- `--border-color`: `#E5E7EB`
- `--divider`: `#E5E7EB`

**Button states** (derived from primary `#0D0D0F`)
- `--btn-primary-bg`: `#0D0D0F`
- `--btn-primary-hover`: `#2A2A2E`
- `--btn-primary-text`: `#FFFFFF`
- `--btn-secondary-border`: `#0D0D0F`
- `--btn-disabled-bg`: `#E5E7EB`
- `--btn-disabled-text`: `#9CA3AF`

#### Typography scale (Tailwind `@theme inline` text-size tokens)

Map each to `[fontSize, { lineHeight, fontWeight }]`:

| Token | Size | Weight | Line-height |
|---|---|---|---|
| `--text-h1` | 32px | 700 | 1.2 |
| `--text-h2` | 24px | 600 | 1.3 |
| `--text-h3` | 20px | 600 | 1.3 |
| `--text-h4` | 16px | 500 | 1.4 |
| `--text-body-lg` | 16px | 400 | 1.6 |
| `--text-body-md` | 14px | 400 | 1.6 |
| `--text-body-sm` | 13px | 400 | 1.6 |
| `--text-caption` | 11px | 400 | 1.4 |

Since Tailwind v4 `@theme` can define font-size tokens but not compound typography, we'll define font-size variables in `@theme inline` and create utility classes for each type style that combine size + weight + line-height.

#### Spacing system (4px base unit)

Tailwind v4 default spacing scale already uses 4px multiples (e.g., `p-1` = 4px, `p-2` = 8px), so the design system's 4px base is natively compatible. We document the mapping for clarity.

#### Grid system

- `--container-max`: `1280px`
- `--grid-gutter`: `24px`
- `--grid-margin`: `24px`

#### Shadows

- `--shadow-sm`: `0px 1px 2px rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0px 4px 12px rgba(0, 0, 0, 0.08)`
- `--shadow-lg`: `0px 12px 24px rgba(0, 0, 0, 0.12)`

#### Border radius

- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `12px`
- `--radius-full`: `9999px`

#### Utility classes (in a `@layer components` block)

Define typography utility classes:
```css
.text-h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 24px; font-weight: 600; line-height: 1.3; }
/* etc. */
```

Define bias-color utility classes:
```css
.bias-left { background-color: var(--left-bias); color: white; }
.bias-center { background-color: var(--center-bias); color: white; }
.bias-right { background-color: var(--right-bias); color: white; }
```

### 3. Install icon library

Run `npm install lucide-react` to add the icon package matching the design reference (line style, 2px stroke, rounded caps).

## Security requirements

None for this task — purely frontend design tokens.

## Acceptance criteria

1. `app/layout.tsx` loads Poppins with weights 400/500/600/700, no Geist references remain.
2. `app/globals.css` contains all design tokens from the reference image, mapped into Tailwind v4 `@theme inline`.
3. Typography utility classes are defined and usable (e.g., `className="text-h1"`).
4. Bias semantic colors are tokenized and accessible via CSS variables.
5. Shadow, border-radius, and spacing tokens match the reference exactly.
6. `lucide-react` is installed.
7. The app compiles without errors (`npm run dev` serves successfully).
8. No dark mode override (light-only per the reference).

## Checks to run

- `npm run dev` — verify the app starts and Poppins loads in the browser
- Visually confirm the font renders as Poppins in DevTools

## Manual test steps

1. Open `http://localhost:3000` in the browser.
2. Open DevTools → Elements → inspect `<html>` → confirm `font-family` includes Poppins.
3. Inspect computed styles to verify CSS custom properties are present (e.g., `--text-primary`, `--left-bias`, `--shadow-md`).
4. The page should render the "Home" heading in Poppins font.
