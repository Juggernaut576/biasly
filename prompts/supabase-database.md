# Supabase Database & Data Access Implementation

## Goal

Implement the complete Supabase database layer for biasly (Skew News), including table schemas, SQL migration/seed files (`supabase/schema.sql`, `supabase/seed.sql`), TypeScript database types (`lib/supabase/types.ts`), client initialization utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`), and data access helper functions for sources, articles, article_analyses, logs, and Oxylabs scheduler tables.

## Skills read

- `AGENTS.md` — Section 7 (Supabase source of truth rules & core tables), Section 5 (Architecture boundaries), Section 6 (Tech stack)
- `.agents/skills/supabase` — Supabase client initialization, environment variable security, RLS best practices, typed client generation
- `.agents/skills/supabase-postgres-best-practices` — Postgres index optimization, foreign key constraints, column data types

## Existing code inspected

- `.env.local` — contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
- `package.json` — project dependencies
- `lib/mock-data.ts` & `lib/mock-detail-data.ts` — data shapes for articles, bias analysis, sources, and breakdown

## Decisions or assumptions

- **Package**: Install `@supabase/supabase-js` via `npm install @supabase/supabase-js`.
- **Core Database Tables**:
  1. `sources`: stores active news sources (id, name, listing_url, parser_strategy, is_active, logo_url, created_at, updated_at).
  2. `articles`: stores scraped articles (id, source_id, url, canonical_url, title, image_url, published_at, raw_text, scraped_at, analyzed_at, created_at). Unique constraint on `url` for deduplication.
  3. `article_analyses`: stores AI sentiment & political framing output (id, article_id, summary, sentiment_score, sentiment_label, bias_score, bias_label, left_percentage, center_percentage, right_percentage, confidence, framing_notes, loaded_terms, disclaimer, model, created_at). Note: `embedding vector(1536)` is excluded until pgvector is enabled in section 20.
  4. `logs`: stores system logs (id, run_id, level, message, metadata, created_at).
  5. `oxylabs_schedules`: stores scheduled scraping jobs (id, source_id, schedule_id, active_status, created_at, updated_at).
  6. `oxylabs_schedule_runs`: stores schedule run executions (id, schedule_id, run_id, status, error, created_at).
- **Security & RLS**: Enable Row Level Security (RLS) on all exposed public tables. Allow public `anon` and `authenticated` roles `SELECT` access to `sources`, `articles`, and `article_analyses` for reading published news. Restrict insert/update/delete operations to the `service_role` client.
- **Client Architecture**:
  - `lib/supabase/client.ts`: browser/public client (`createClient`) using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `lib/supabase/server.ts`: server/admin client (`createAdminClient`) using `SUPABASE_SERVICE_ROLE_KEY` for background scraping, AI pipeline, and logging.
  - `lib/supabase/types.ts`: TypeScript definitions representing database row types and table schemas.
- **Seed Data (`supabase/seed.sql`)**: Include initial active sources (Reuters, BBC, Fox News, CNN, The Wall Street Journal, The New York Times, The Washington Post, Newsmax) so scraping loads active sources directly from Supabase as required by section 7.

## Files to change

### New files
- `supabase/schema.sql` — complete database schema SQL definition (tables, constraints, indexes, RLS policies)
- `supabase/seed.sql` — SQL seed script with active news sources
- `lib/supabase/types.ts` — TypeScript types for database tables
- `lib/supabase/client.ts` — browser-side Supabase client
- `lib/supabase/server.ts` — server-side & service role Supabase client
- `lib/supabase/data.ts` — data access helpers (getSources, getArticles, getArticleDetail, insertArticles, insertAnalysis, logMessage)

### Modified files
- `package.json` — add `@supabase/supabase-js` dependency

## Implementation requirements

1. **Install `@supabase/supabase-js`**:
   - Run `npm install @supabase/supabase-js`.

2. **Database Schema (`supabase/schema.sql`)**:
   - Create tables with exact field types:
     - `sources`: `id` (uuid/bigint primary key), `name` (text), `listing_url` (text unique), `parser_strategy` (text), `is_active` (boolean default true), `logo_url` (text), `created_at` (timestamptz), `updated_at` (timestamptz).
     - `articles`: `id` (uuid/bigint primary key), `source_id` (foreign key to sources.id), `url` (text unique), `canonical_url` (text), `title` (text), `image_url` (text), `published_at` (timestamptz), `raw_text` (text), `scraped_at` (timestamptz), `analyzed_at` (timestamptz nullable).
     - `article_analyses`: `id` (uuid/bigint primary key), `article_id` (foreign key to articles.id unique), `summary` (text), `sentiment_score` (numeric), `sentiment_label` (text), `bias_score` (numeric), `bias_label` (text), `left_percentage` (integer), `center_percentage` (integer), `right_percentage` (integer), `confidence` (numeric), `framing_notes` (jsonb/text), `loaded_terms` (jsonb/text), `disclaimer` (text), `model` (text), `created_at` (timestamptz).
     - `logs`: `id` (uuid primary key), `run_id` (text), `level` (text), `message` (text), `metadata` (jsonb), `created_at` (timestamptz).
     - `oxylabs_schedules`: `id` (uuid primary key), `source_id` (foreign key to sources.id), `schedule_id` (text unique), `active_status` (boolean), `created_at` (timestamptz), `updated_at` (timestamptz).
     - `oxylabs_schedule_runs`: `id` (uuid primary key), `schedule_id` (foreign key to oxylabs_schedules.id), `run_id` (text), `status` (text), `error` (text), `created_at` (timestamptz).
   - Add performance indexes on `articles(url)`, `articles(source_id)`, `articles(analyzed_at)`, `article_analyses(article_id)`.
   - Add RLS policies for `public` read access on `sources`, `articles`, and `article_analyses`.

3. **Database Seed Script (`supabase/seed.sql`)**:
   - Insert initial active sources into `sources` table.

4. **TypeScript Database Types (`lib/supabase/types.ts`)**:
   - Define exact TypeScript interfaces for `Source`, `Article`, `ArticleAnalysis`, `Log`, `OxylabsSchedule`, and `OxylabsScheduleRun`.

5. **Client Utilities (`lib/supabase/client.ts` & `lib/supabase/server.ts`)**:
   - `createClient()` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `createAdminClient()` using `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

6. **Data Access Helpers (`lib/supabase/data.ts`)**:
   - `getActiveSources()`: fetches active sources from Supabase.
   - `getArticles(limit)`: fetches analyzed articles with source details for homepage grid.
   - `getArticleById(id)`: fetches article with full analysis data for news details page.
   - `checkArticleUrlsExist(urls)`: chunked deduplication URL check (up to 15 URLs per query per AGENTS.md rule).
   - `logMessage(run_id, level, message, metadata)`: records system logs.

## Security requirements

- `SUPABASE_SERVICE_ROLE_KEY` must strictly remain server-side in `lib/supabase/server.ts` and `.env.local`, never exposed to client components or prefixed with `NEXT_PUBLIC_`.
- Public browser client (`createClient`) relies on RLS policies for security.

## Acceptance criteria

1. `@supabase/supabase-js` package installs without conflicts.
2. `supabase/schema.sql` and `supabase/seed.sql` provide full DDL and initial source data.
3. Supabase clients in `lib/supabase/client.ts` and `lib/supabase/server.ts` initialize cleanly with environment variables.
4. TypeScript types in `lib/supabase/types.ts` strictly match table schemas.
5. Data access functions in `lib/supabase/data.ts` compile without errors and implement small-chunk deduplication (`.in()` limit 15).
6. Next.js app builds cleanly (`npm run dev`).

## Checks to run

- `npm run dev` to verify clean build and client initialization.
- Execute SQL schema in Supabase if requested or test client connection via node script.

## Exact manual test steps expected after implementation

1. Run `npm run dev`.
2. Inspect `supabase/schema.sql` and `supabase/seed.sql`.
3. Verify `lib/supabase/client.ts` and `lib/supabase/server.ts` initialize Supabase clients.
4. Run test node snippet or client check to verify connection to `https://vmvicejuwxglimrvnodu.supabase.co`.
