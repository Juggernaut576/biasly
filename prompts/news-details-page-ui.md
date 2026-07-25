# News Details Page UI Implementation

## Goal

Implement the news details page UI at `/article/[id]` matching the reference image pixel-perfectly, displaying article header metadata, main image with caption, two-column article body vs sidebar layout (Bias Analysis, AI Summary, Source Breakdown), related stories grid, newsletter subscription CTA banner, and site footer. Update homepage cards so clicking a news card navigates to `/article/[id]`.

## Skills read

- `AGENTS.md` — product rules, workflow, tech stack, architecture, prompt requirements
- Existing UI components inspected: `components/ui/button.tsx`, `components/ui/chip.tsx`, `components/ui/bias-meter.tsx`, `components/ui/home-news-card.tsx`, `components/layout/header.tsx`, `components/layout/footer.tsx`
- Existing page layouts: `app/page.tsx`
- Mock data inspected: `lib/mock-data.ts`

## Existing code inspected

- `lib/mock-data.ts` — contains mock articles list. We will expand this with detailed article content, author, date, read time, image caption, full body paragraphs, AI summary bullet points, source breakdown list, and related stories data for article details.
- `components/layout/header.tsx` — sticky header component (reused)
- `components/layout/footer.tsx` — site footer component (reused)
- `components/ui/home-news-card.tsx` — clickable card component (will wrap with Next.js `Link` to `/article/${id}`)

## Decisions

- **Route Structure**: Dynamic route at `app/article/[id]/page.tsx` representing an article details page. Default data fallback provided so `/article/1` (and any ID) displays the complete full analysis matching the prompt screenshot.
- **Mock Data Expansion**: Extend `lib/mock-data.ts` or add `lib/mock-detail-data.ts` to provide rich article content (author, published date, read time, hero caption & photo credit, full body text, quote callouts, inline bias distribution, sidebar bias analysis, AI summary bullet points, source breakdown with political leanings, and 6 related stories).
- **Component Architecture**:
  - Re-use existing `Header` and `Footer` layout components.
  - Create `components/article/article-header.tsx` (breadcrumbs, title, author/date/read time, save/share/more buttons).
  - Create `components/article/article-hero.tsx` (hero image with caption & photo credit).
  - Create `components/article/bias-distribution-bar.tsx` (inline article bias distribution card).
  - Create `components/article/article-body.tsx` (paragraphs, quotes, related stories grid).
  - Create `components/article/sidebar-bias-analysis.tsx` (Overall Bias card, breakdown bars, explanation text, action button).
  - Create `components/article/sidebar-ai-summary.tsx` (AI summary card with bullet points, disclaimer, feedback button).
  - Create `components/article/sidebar-source-breakdown.tsx` (Source Breakdown card, distribution bars, top sources list with colored bias tags, view all sources button).
  - Create `components/article/related-stories.tsx` (2-column grid of related news cards).
  - Create `components/article/newsletter-cta.tsx` (full-width email subscribe banner).
- **Navigation Integration**: Update `HomeNewsCard` in `components/ui/home-news-card.tsx` to wrap card titles/images in `<Link href={`/article/${id}`}>` for seamless navigation.

## Files to change

### New files
- `app/article/[id]/page.tsx` — article details page route
- `lib/mock-detail-data.ts` — article detail data model and content
- `components/article/article-header.tsx` — article title & metadata header
- `components/article/article-hero.tsx` — article photo & caption
- `components/article/bias-distribution-bar.tsx` — inline bias distribution bar
- `components/article/article-body.tsx` — article content paragraphs & quotes
- `components/article/sidebar-bias-analysis.tsx` — sidebar bias analysis card
- `components/article/sidebar-ai-summary.tsx` — sidebar AI summary card
- `components/article/sidebar-source-breakdown.tsx` — sidebar source breakdown card
- `components/article/related-stories.tsx` — related stories grid
- `components/article/newsletter-cta.tsx` — newsletter subscription banner

### Modified files
- `components/ui/home-news-card.tsx` — wrap card with Link to `/article/${id}`
- `lib/mock-data.ts` — re-export detail helper or update interface if necessary

## Implementation requirements

### Visual Interpretation & Design Specs

1. **Breadcrumb & Category**:
   - Small uppercase/muted text: `Politics · United States` (`text-xs font-medium text-[var(--text-secondary)]`).
2. **Article Title**:
   - Font: `Poppins`, bold, size `text-3xl sm:text-4xl`, line height tight, dark color `#0D0D0F`.
3. **Byline & Actions**:
   - Left: `By David Morgan | May 31, 2026 | 12 min read` in `text-xs text-[var(--text-secondary)]`.
   - Right: Action buttons (`Save` with bookmark icon, `Share` with share icon, `...` more options menu) with light rounded borders and subtle hover states.
4. **Hero Image & Caption**:
   - Image: Full aspect ratio ~16/9, rounded corners (`rounded-[var(--radius-lg)]`).
   - Caption: `text-xs text-[var(--text-secondary)] mt-2` with caption text and photo credit.
5. **Two-Column Main Section**:
   - Grid layout: `grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8`.
6. **Left Column (Article Content & Related Stories)**:
   - **Inline Bias Distribution Card**: Light background `#F9FAFB`, rounded border `#E5E7EB`, padding `p-4`, header `Bias Distribution` with (ⓘ) icon, colored horizontal percentage bar (Left 20% red `#B91C1C`, Center 31% light grey `#F3F4F6`, Right 49% dark blue `#1E3A8A`), label subtext `12 sources`.
   - **Article Paragraphs**: Clean readable typography (`text-[15px] leading-relaxed text-[#111827] space-y-4`).
   - **Blockquote / Highlight Quote**: Styled quote with left border or italic styling matching news editorial standards (`font-medium border-l-2 border-black pl-4 my-6 text-[#111827]`).
   - **Related Stories Grid**: Heading `Related Stories` (`text-lg font-bold`), 2-column grid of horizontal card items (thumbnail image 80x80, category/location text, title, date/read time).
7. **Right Column (Sidebar)**:
   - **Bias Analysis Card**:
     - Light card background with border & rounded corners.
     - Title `Bias Analysis` with info icon (ⓘ).
     - Overall Bias text: `Right 49%` in large bold dark blue text (`#1E3A8A`).
     - Subtext: `Based on 12 balanced sources` (clickable link style).
     - Horizontal breakdown bars for Left (20% red), Center (31% gray), Right (49% blue).
     - Explanation paragraph text explaining scoring.
     - Button: `How We Analyze Bias` (full-width outline button).
   - **AI Summary Card**:
     - Header `AI Summary` with info icon (ⓘ), subtitle `Generated May 31, 2026 · 3 min read`.
     - 5 bullet points with clean spacing and bullet dots.
     - Subtext: `AI summaries can make mistakes.`
     - Button: `Provide Feedback` (full-width outline button).
   - **Source Breakdown Card**:
     - Header `Source Breakdown` with info icon (ⓘ), subtitle `12 Total Sources`.
     - Breakdown bars for Left 2 (20%), Center 4 (31%), Right 6 (49%).
     - Top Sources list: Fox News (Right, blue text), The Wall Street Journal (Center, gray text), Reuters (Center, gray text), BBC (Center, gray text), CNN (Left, red text), The New York Times (Center, gray text), The Washington Post (Center, gray text), Newsmax (Right, blue text).
     - Button: `View All Sources` (full-width outline button).
8. **Newsletter CTA Banner**:
   - Full width banner before footer, light background `#F3F4F6`, rounded corners, flex container (Heading & description on left, email input field & `Subscribe` black button on right).
9. **Footer**:
   - Reused `Footer` component.
10. **Responsiveness**:
    - Desktop: 2-column layout with fixed 360px sidebar.
    - Mobile/Tablet: Stacked 1-column layout (Hero -> Article Body -> Sidebar Analysis -> Related Stories -> Newsletter -> Footer).

## Security requirements

- Standard Next.js server components, no unsafe HTML injections or direct DOM mutations.
- Input field in newsletter CTA is purely UI state or client form.

## Acceptance criteria

1. Navigating to `/article/1` loads the complete News Details Page matching the reference UI image.
2. Clicking any news card on the homepage navigates to `/article/[id]`.
3. All components (Header, Article Header, Hero Image with caption, Inline Bias Card, Article Body, 3 Sidebar Cards, Related Stories, Newsletter Banner, Footer) render with pixel-perfect visual styling, typography, colors, and layout.
4. Sidebar cards display correct bias scores, AI summary bullets, and source breakdown with political leanings.
5. Responsive layout adapts cleanly to desktop (2-column) and mobile/tablet (1-column).
6. Build succeeds with zero Next.js or TypeScript compilation errors.

## Checks to run

- `npm run dev` / Next.js build check
- Browser subagent visual inspection on `http://localhost:3000/article/1` and comparison with prompt mockup.

## Exact manual test steps expected after implementation

1. Start dev server with `npm run dev`
2. Open browser at `http://localhost:3000`
3. Click on the first news card ("Trump Sends Iran Revised Peace Proposal...")
4. Verify URL changes to `http://localhost:3000/article/1`
5. Verify page renders complete article details with:
   - Header & Category metadata
   - Title, author ("By David Morgan"), date ("May 31, 2026"), 12 min read, Save/Share/More buttons
   - Hero photo of Donald Trump with caption & photo credit
   - Inline Bias Distribution card
   - Article body text & quote block
   - Right sidebar cards (Bias Analysis, AI Summary, Source Breakdown)
   - 6 Related Stories cards
   - Newsletter CTA subscription box
   - Footer
