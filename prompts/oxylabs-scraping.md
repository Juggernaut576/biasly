# Oxylabs Scraping Pipeline Implementation

## Goal

Implement the on-demand, scrape-to-insert manual scraping pipeline for biasly (Skew News) using the Oxylabs Web Scraper API, Cheerio HTML parsing, Supabase storage, and strict candidate URL filtering & article validation rules as specified in `AGENTS.md` (Sections 8–17).

## Skills read

- `AGENTS.md` — Section 8 (Scraping source selection), Section 9 (Correct scraping model & scrape-to-insert pipeline), Section 10 (Article storage rules), Section 11 (Homepage article link extraction), Section 12 (Candidate URL filtering), Section 13 (Article validation and cleanup), Section 14 (API route method rules), Section 15 (Admin secret rule), Section 16 (Manual scraping behavior and logs), Section 17 (Testing output after implementation)
- `.agents/skills/oxylabs-web-scraper` — Oxylabs Web Scraper API authentication, parameters, realtime queries
- `.agents/skills/supabase` — Supabase data operations, `.in()` query limits (<= 15), server-side service role client

## Existing code inspected

- `.env.local` — contains `OXYLABS_USERNAME` / `OXYLABS_PASSWORD` and `BIASLY_ADMIN_SECRET`
- `supabase/schema.sql` — `sources`, `articles`, `logs` tables
- `lib/supabase/data.ts` — `getActiveSources()`, `checkArticleUrlsExist()`
- `lib/supabase/server.ts` — `createAdminClient()`

## Decisions or assumptions

- **Package Dependencies**: Use `cheerio` for HTML parsing and DOM extraction (`npm install cheerio`).
- **Oxylabs API Credentials**: Read `OXYLABS_USERNAME` (or `OXY_WSA_USERNAME`) and `OXYLABS_PASSWORD` (or `OXY_WSA_PASSWORD`) from environment variables. Use HTTP Basic Authentication against `POST https://realtime.oxylabs.io/v1/queries` with `source: "universal"`.
- **Admin Authentication**: Secure `POST /api/scrape` with `x-biasly-admin-secret` request header matched against `BIASLY_ADMIN_SECRET` env variable.
- **Scrape-to-Insert Flow**:
  1. Fetch active sources from Supabase `sources` table.
  2. Scrape live homepage HTML using Oxylabs.
  3. Extract story card links from homepage DOM.
  4. Reject candidate URLs on the canonical **non-article reject list** (category, topic, author, search, navigation, show/program, live, game, product/shopping, corporate/support, newsletter, video-only).
  5. Check existing article URLs in Supabase using `checkArticleUrlsExist` (max 15 URLs per `.in()` filter chunk).
  6. Scrape detail page HTML via Oxylabs for non-duplicate candidates.
  7. Validate detail pages (must have article-specific URL/title, published date, image URL, and >= 3 paragraphs OR >= 900 clean text characters).
  8. Clean `raw_text` (remove ads, scripts, CSS, inline errors, newsletter popups, social sharing).
  9. Insert valid articles into Supabase `articles` table using `service_role` client.
  10. Log detailed console progress messages and return a full JSON summary object.

## Files to change

### New files
- `lib/scraping/oxylabs.ts` — Oxylabs Realtime API client
- `lib/scraping/extractor.ts` — Cheerio homepage link extractor & source-specific candidate URL filters
- `lib/scraping/validator.ts` — Detail page HTML parser, content gate validator & raw_text cleaner
- `lib/scraping/pipeline.ts` — Orchestrator running the complete scrape-to-insert flow
- `app/api/scrape/route.ts` — `POST /api/scrape` endpoint protected by `x-biasly-admin-secret` header

### Modified files
- `package.json` — add `cheerio` dependency

## Implementation requirements

1. **Oxylabs Client (`lib/scraping/oxylabs.ts`)**:
   - `fetchPageHtml(url: string, renderHtml = false)`: sends POST request to `https://realtime.oxylabs.io/v1/queries` with Basic Auth using credentials from `.env.local`.

2. **Homepage Link Extraction (`lib/scraping/extractor.ts`)**:
   - Parse homepage HTML with Cheerio.
   - Extract `href` attributes from anchor tags within story/card containers.
   - Resolve relative URLs against the source homepage URL.
   - Reject URLs matching the **non-article reject list**:
     - category/section (`/world/`, `/politics/`, `/sections/`, `/category/`, `/us-news/`, `/topics/`)
     - author, search, navigation, footer, menu
     - show, program, podcast, live feeds, game pages
     - product, review, shopping, corporate, support, newsletter, video-only
   - Enforce source-specific article patterns:
     - Reuters: URLs with date/slug structure or `-202[0-9]-` pattern, excluding listing/category pages.
     - BBC: `/news/articles/c` or story paths, excluding `/sport/`, `/live/`.
     - Fox News: `/politics/`, `/us/`, `/media/` story slugs, excluding `/person/`, `/shows/`, `/category/`.
     - CNN: `/202[0-9]/` date-based article paths, excluding `/video/`, `/audio/`, `/specials/`.
     - Guardian: `/202[0-9]/[a-z]+/` date/category article paths, excluding `/profile/`, `/index/`.
     - NPR: `/202[0-9]/` or story ID paths, excluding `/sections/`, `/series/`.

3. **Article Validation & Cleaning (`lib/scraping/validator.ts`)**:
   - Extract title, meta image, canonical URL, published date (`og:article:published_time`, `<time>`, `pubdate`), and main body text.
   - Clean `raw_text`: strip `<script>`, `<style>`, `<iframe>`, ad containers, newsletter signup forms, social share bars, inline CSS class dumps, and navigation boilerplate.
   - Apply Article Content Gate:
     - Must have valid title, image URL, published date, and article-specific URL.
     - Must have >= 3 clean paragraphs OR >= 900 clean characters.

4. **Pipeline Orchestrator (`lib/scraping/pipeline.ts`)**:
   - `runManualScrapePipeline(options)`:
     - Load selected active sources from Supabase.
     - Process each source up to requested limit (default 5 valid articles per source).
     - Query Supabase URL existence check using chunked `.in()` filter (<= 15 URLs per query).
     - Insert valid articles append-only into `articles` table.
     - Output clean server-side progress logs to console and log entry to Supabase `logs` table.
     - Return final run summary object.

5. **API Route (`app/api/scrape/route.ts`)**:
   - Method: `POST`
   - Validate `x-biasly-admin-secret` header against `BIASLY_ADMIN_SECRET` env var. Return `401 Unauthorized` if invalid or missing.
   - Call `runManualScrapePipeline()` and return summary JSON.

## Security requirements

- `BIASLY_ADMIN_SECRET` must be required as request header `x-biasly-admin-secret` on `POST /api/scrape`.
- `OXYLABS_USERNAME` & `OXYLABS_PASSWORD` remain server-side only.

## Acceptance criteria

1. `cheerio` package installed without conflicts.
2. `POST /api/scrape` rejects missing or incorrect `x-biasly-admin-secret` with `401`.
3. Candidate URLs are filtered against the canonical non-article reject list and deduplicated in Supabase using max 15 URLs per `.in()` filter chunk.
4. Article detail pages pass content gate validation (image, title, published date, clean raw_text).
5. Valid articles are saved append-only to Supabase.
6. Console logs print detailed progress during execution and output the required summary object at the end.

## Checks to run

- `npm run dev` to verify route loading.
- Test curl `POST /api/scrape` with `x-biasly-admin-secret` header.

## Exact manual test steps expected after implementation

1. Run `npm run dev`.
2. Execute curl command:
   ```bash
   curl -X POST http://localhost:3000/api/scrape \
     -H "Content-Type: application/json" \
     -H "x-biasly-admin-secret: YOUR_BIASLY_ADMIN_SECRET" \
     -d '{"limitPerSource": 2}'
   ```
3. Check dev server terminal for real-time progress logs.
4. Inspect returned JSON summary object.
