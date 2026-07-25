# Oxylabs Scheduler & Vercel Cron Integration Plan

## Goal
Implement Oxylabs Scheduler API integration and automatic hourly processing with Vercel Cron for active news sources in Supabase.

## Skills Read
- `.agents/skills/oxylabs-web-scraper/SKILL.md`
- `.agents/skills/supabase/SKILL.md`

## Existing Code Inspected
- `supabase/schema.sql` (inspecting `oxylabs_schedules` and `oxylabs_schedule_runs` tables)
- `supabase/seed.sql` (active sources: Reuters, BBC News, Fox News, CNN, The Guardian, NPR)
- `lib/scraping/oxylabs.ts`
- `lib/scraping/pipeline.ts`
- `lib/ai/pipeline.ts`
- `AGENTS.md` Section 18

## Decisions & Assumptions
1. Active sources currently in Supabase (`sources` table):
   - **Reuters** (`https://www.reuters.com`)
   - **BBC News** (`https://www.bbc.com/news`)
   - **Fox News** (`https://www.foxnews.com`)
   - **CNN** (`https://www.cnn.com`)
   - **The Guardian** (`https://www.theguardian.com/us`)
   - **NPR** (`https://www.npr.org`)
2. **64-bit Integer Precision**: Oxylabs `schedule_id` and `job_id` values exceed `Number.MAX_SAFE_INTEGER`. All IDs will be extracted from raw response text via regex before `JSON.parse` to avoid digit corruption.
3. **Use `/runs` Endpoint**: Use `GET /schedules/{id}/runs` and filter to `result_status === 'done'` before fetching job HTML content.
4. **Orphan Deactivation**: Syncing schedules will list existing Oxylabs schedules via `GET /v1/schedules`, compare against DB rows in `oxylabs_schedules`, and deactivate unlisted schedules.
5. **Cron Security**: The Vercel Cron route (`GET /api/cron/pipeline`) will check the `CRON_SECRET` header in production environments (bypassed in local development).
6. **Vercel Cron Config**: Registered in `vercel.json` to trigger at `:15` past every hour (`15 * * * *`).

## Files Likely to Change
- `lib/scraping/oxylabs-scheduler.ts` [NEW] — Oxylabs Scheduler API client with raw response text ID extraction, schedule creation, listing, run fetching, and orphan deactivation.
- `lib/scraping/scheduler-pipeline.ts` [NEW] — Scheduled result processing pipeline (fetches scheduled homepage HTML, extracts candidate links, dedupes, detail scrapes, validates, and inserts articles).
- `app/api/oxylabs/schedules/route.ts` [NEW] — `POST` (sync schedules) & `GET` (list schedules) protected by `x-biasly-admin-secret`.
- `app/api/oxylabs/scheduled-results/process/route.ts` [NEW] — `POST` (manual scheduled result processing) protected by `x-biasly-admin-secret`.
- `app/api/oxylabs/runs/route.ts` [NEW] — `GET` (fetch Oxylabs schedule runs) protected by `x-biasly-admin-secret`.
- `app/api/cron/pipeline/route.ts` [NEW] — `GET` (internal Vercel Cron route chaining scheduled result processing then AI analysis).
- `vercel.json` [NEW] — Vercel Cron configuration (`15 * * * *`).

## Implementation Requirements
1. **Raw Text ID Extraction**: Extract `schedule_id` and `job_id` digits using regex on raw HTTP response text before `JSON.parse` calls.
2. **Orphan Deactivation**: Compare Oxylabs API schedule list against `oxylabs_schedules` DB records and deactivate orphans.
3. **Reuse Pipeline Logic**: Reuse `extractHomepageLinks`, candidate URL filters, candidate dedupe (chunked in <=15 filters), detail page fetch, `validateArticleContent`, and DB append-only inserts.
4. **Automatic Cron Chain**: Route `/api/cron/pipeline` runs scheduled result processing first, then runs pending AI analysis second (running AI analysis even if processing fails).
5. **Logging**: Emit clean console logs during execution and return summary objects.

## Security Requirements
- All `POST` action routes require header `x-biasly-admin-secret` matching `BIASLY_ADMIN_SECRET` environment variable.
- Cron route requires `CRON_SECRET` authorization in production.

## Acceptance Criteria
- Sync schedules creates/updates schedule rows in `oxylabs_schedules`.
- Process route reads completed scheduled homepage HTML and inserts valid articles.
- Cron route runs both scheduled processing and AI analysis sequentially.
- Zero TypeScript compilation errors (`npx tsc --noEmit`).

## Checks to Run
- `npx tsc --noEmit`

## Exact Manual Test Steps Expected After Implementation
1. **Sync Schedules**:
   ```bash
   curl.exe -X POST http://localhost:3000/api/oxylabs/schedules \
     -H "Content-Type: application/json" \
     -H "x-biasly-admin-secret: ahsfd459064"
   ```
2. **List Schedules**:
   ```bash
   curl.exe -X GET http://localhost:3000/api/oxylabs/schedules
   ```
3. **Process Scheduled Results**:
   ```bash
   curl.exe -X POST http://localhost:3000/api/oxylabs/scheduled-results/process \
     -H "Content-Type: application/json" \
     -H "x-biasly-admin-secret: ahsfd459064"
   ```
4. **Trigger Vercel Cron Route Locally**:
   ```bash
   curl.exe -X GET http://localhost:3000/api/cron/pipeline
   ```
