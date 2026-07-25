# AI Article Analysis Pipeline Implementation

## Goal

Implement the AI article analysis pipeline for biasly (Skew News) using Vercel AI SDK (`ai` and `@ai-sdk/openai` / structured outputs with Zod), Supabase persistence (`article_analyses` table), and dynamic UI binding for homepage news cards and news details page.

## Skills read

- `AGENTS.md` — Section 19 (AI analysis and UI framing), Section 7 (Supabase schema rules for article_analyses), Section 14 (API route rules: `POST /api/analyze`), Section 15 (Admin secret rule: `x-biasly-admin-secret`), Section 21 (Security & Env vars)
- `.agents/skills/ai-sdk` — Vercel AI SDK `generateObject`, structured outputs with Zod, OpenAI model provider usage
- `.agents/skills/supabase` — Supabase data operations, pending-analysis LEFT JOIN detection

## Existing code inspected

- `.env.local` — contains Supabase and Oxylabs credentials; requires `OPENAI_API_KEY`
- `supabase/schema.sql` — `article_analyses` table definition
- `lib/supabase/data.ts` — data access helpers (`getArticles`, `getArticleById`)
- `components/ui/home-news-card.tsx` — homepage news card UI
- `app/page.tsx` — homepage layout

## Decisions or assumptions

- **Package Dependencies**: Install `ai`, `@ai-sdk/openai`, and `zod` via `npm install ai @ai-sdk/openai zod`.
- **API Provider & Model**: Use OpenAI `gpt-4o-mini` (or `gpt-4o`) via `@ai-sdk/openai` for fast, cost-effective, high-precision structured analysis.
- **Pending-Analysis Check**: Detect pending articles by querying Supabase `articles` LEFT JOINed to `article_analyses` (where no `article_analyses` row exists). Never rely on `analyzed_at IS NULL` alone.
- **Structured Schema (Zod)**:
  - `summary`: neutral, objective 2-3 sentence article summary.
  - `sentimentScore`: number from -1.0 to 1.0.
  - `sentimentLabel`: 'positive' | 'neutral' | 'negative'.
  - `leftPercentage`: integer 0 to 100.
  - `centerPercentage`: integer 0 to 100.
  - `rightPercentage`: integer 0 to 100.
  - `biasLabel`: 'left' | 'center' | 'right' | 'mixed' | 'unclear'.
  - `confidence`: number 0.0 to 1.0.
  - `framingNotes`: array of `{ perspective: string, description: string, example: string }`.
  - `loadedTerms`: array of `{ term: string, biasType: string, context: string }`.
  - `disclaimer`: standard AI estimation disclaimer ("Political framing is AI-estimated based on article text evidence.").
- **Derived Bias Score**: `biasScore = (rightPercentage - leftPercentage) / 100`.
- **Constraint Validation**: Ensure `leftPercentage + centerPercentage + rightPercentage === 100`.
- **Batch Processing**: Process pending articles in configurable batches (default batch size 5) until all pending valid articles are analyzed.
- **Persistence**: Save analysis to `article_analyses` and update `articles.analyzed_at` timestamp ONLY after successful insertion.
- **UI Data Integration**: Update `app/page.tsx` to fetch analyzed articles directly from Supabase via `getArticles()`, rendering real AI-analyzed news cards with live sentiment, framing percentages, and details links!

## Files to change

### New files
- `lib/ai/analysis-schema.ts` — Zod schema for structured AI output validation
- `lib/ai/analyzer.ts` — Vercel AI SDK analysis function using `generateObject`
- `lib/ai/pipeline.ts` — AI analysis orchestrator running pending-analysis check, batch processing, DB persistence, and summary logging
- `app/api/analyze/route.ts` — `POST /api/analyze` route protected by `x-biasly-admin-secret` header

### Modified files
- `package.json` — add `ai`, `@ai-sdk/openai`, `zod`
- `app/page.tsx` — fetch analyzed articles live from Supabase
- `app/article/[id]/page.tsx` — fetch full article and analysis live from Supabase

## Implementation requirements

1. **Install AI Packages**:
   - `npm install ai @ai-sdk/openai zod`.

2. **Structured Analysis Schema (`lib/ai/analysis-schema.ts`)**:
   - Define `ArticleAnalysisSchema` using Zod matching `AGENTS.md` framing & percentage constraints.

3. **Vercel AI SDK Analyzer (`lib/ai/analyzer.ts`)**:
   - `analyzeArticleText(title: string, rawText: string)`: invokes `generateObject` with `openai('gpt-4o-mini')` and `ArticleAnalysisSchema`.
   - Prompt instructs the model to evaluate framing solely on article body evidence, maintain total percentage sum of 100, and generate neutral summary.

4. **Analysis Pipeline Orchestrator (`lib/ai/pipeline.ts`)**:
   - `runAiAnalysisPipeline(options)`:
     - Perform pending-analysis check via Supabase query (LEFT JOIN `articles` to `article_analyses` where `article_analyses.id` IS NULL).
     - Process pending articles in batches of size `batchSize` (default 5).
     - For each pending article: run AI analysis, validate schema, derive `bias_score = (right - left) / 100`, insert into `article_analyses`, and update `articles.analyzed_at = NOW()`.
     - Log neat progress messages and return final JSON summary object.

5. **API Route (`app/api/analyze/route.ts`)**:
   - Method: `POST /api/analyze`
   - Requires `x-biasly-admin-secret` request header matched against `BIASLY_ADMIN_SECRET` / `x-SKEW-admin-secret`. Returns `401` if invalid.
   - Triggers `runAiAnalysisPipeline()` and returns summary JSON.

6. **UI Integration (`app/page.tsx` & `app/article/[id]/page.tsx`)**:
   - Update `app/page.tsx` to read real analyzed articles from Supabase via `getArticles(12)`.
   - Update `app/article/[id]/page.tsx` to read full article details and analysis via `getArticleById(id)`.

## Security requirements

- `OPENAI_API_KEY` remains server-side only in `.env.local`.
- `POST /api/analyze` requires `x-biasly-admin-secret` header.

## Acceptance criteria

1. `ai`, `@ai-sdk/openai`, `zod` installed without conflicts.
2. `POST /api/analyze` validates `x-biasly-admin-secret` and rejects unauthorized requests with `401`.
3. AI analysis generates neutral summary, sentiment score, Left/Center/Right percentages summing to 100, bias score, framing notes, and loaded terms.
4. `article_analyses` rows are inserted and `analyzed_at` timestamps are updated for analyzed articles.
5. Homepage (`app/page.tsx`) and News Details (`app/article/[id]/page.tsx`) display live AI-analyzed articles from Supabase.
6. `npm run dev` builds cleanly.

## Checks to run

- `npm run dev` to verify clean compilation.
- Test curl `POST /api/analyze` with `x-biasly-admin-secret` header.

## Exact manual test steps expected after implementation

1. Add `OPENAI_API_KEY=sk-...` to `.env.local`.
2. Run `npm run dev`.
3. Trigger AI analysis via curl:
   ```bash
   curl -X POST http://localhost:3000/api/analyze \
     -H "Content-Type: application/json" \
     -H "x-biasly-admin-secret: ahsfd459064"
   ```
4. Check dev server logs for real-time progress.
5. Open `http://localhost:3000` in browser to see real AI-analyzed news cards live from Supabase!
