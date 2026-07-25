# PostHog Analytics Integration Plan

## Goal
Manually install and integrate PostHog analytics (`posthog-js`) for Next.js App Router without relying on the interactive `@posthog/wizard` CLI tool.

## Skills Read
- Next.js App Router patterns (`node_modules/next/dist/docs/`)

## Existing Code Inspected
- `package.json`
- `app/layout.tsx`
- `.env.local`

## Decisions & Assumptions
- The `@posthog/wizard` command fails in non-interactive shell environments because it tries to initiate interactive web browser auth.
- Manual setup via `posthog-js` with a Next.js client-side provider component (`PostHogProvider`) is the standard, reliable pattern recommended by PostHog for Next.js App Router.
- Environment variables `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` (defaulting to `https://us.i.posthog.com` or `https://eu.i.posthog.com`) will be configured in `.env.local`.

## Files Likely to Change
- `package.json` (add `posthog-js` dependency)
- `components/providers/posthog-provider.tsx` (new PostHog provider client component)
- `app/layout.tsx` (wrap layout in `PostHogProvider`)
- `.env.local` (add PostHog env keys)

## Implementation Requirements
1. Install `posthog-js`.
2. Create `components/providers/posthog-provider.tsx` with `'use client'` initialized using `posthog.init()`.
3. Wrap `RootLayout` in `app/layout.tsx` with `<PostHogProvider>`.
4. Gracefully handle missing API key during local development (avoid runtime crashes if key is empty).

## Security Requirements
- Only expose `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to client-side.

## Acceptance Criteria
- Clean installation of `posthog-js`.
- Zero TypeScript compilation errors (`npx tsc --noEmit`).
- PostHog client initializes without breaking Next.js hydration or dev server.

## Checks to Run
- `npm install posthog-js`
- `npx tsc --noEmit`

## Exact Manual Test Steps Expected After Implementation
1. Add your PostHog API Key (`phc_...`) to `.env.local`.
2. Start the dev server (`npm run dev`).
3. Open `http://localhost:3000` in browser.
4. Check browser dev console / network tab to verify events sending to `https://us.i.posthog.com/e/`.
