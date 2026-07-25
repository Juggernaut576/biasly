# Implementation Prompt: pgvector Support and Related Articles Feature

## Goal
Enable `pgvector` extension in Supabase, add `embedding vector(1536)` column to `article_analyses`, update the AI pipeline (`lib/ai/pipeline.ts` and `lib/ai/analyzer.ts`) to generate text embeddings alongside analysis, create a cosine similarity search query/RPC in Supabase, and render a **Related Articles** section on the news details page (`app/article/[id]/page.tsx`).

---

## Skills Read
- `AGENTS.md` (Sections 7, 19, 20)
- `.agents/skills/supabase` (Postgres extensions, RLS policies, vector similarity queries)
- `.agents/skills/ai-sdk` (Embedding generation)

---

## Existing Code Inspected
- `supabase/schema.sql` (Tables DDL & RLS policies)
- `lib/supabase/types.ts` (Database TypeScript interfaces)
- `lib/supabase/data.ts` (Data access & query functions)
- `lib/ai/analyzer.ts` (AI Analysis generation with Groq / Vercel AI SDK)
- `lib/ai/pipeline.ts` (AI pipeline orchestrator & database persistence)
- `app/api/analyze/route.ts` (`POST /api/analyze` endpoint)
- `app/article/[id]/page.tsx` (News details page component)

---

## Decisions & Architectural Choices

1. **pgvector Schema & Extension**:
   - Execute SQL: `CREATE EXTENSION IF NOT EXISTS vector;`
   - Add column: `ALTER TABLE public.article_analyses ADD COLUMN IF NOT EXISTS embedding vector(1536);`
   - Index: Create an `ivfflat` index on `article_analyses(embedding vector_cosine_ops)`.
   - RPC Function: Create `match_related_articles(query_embedding vector(1536), match_threshold float, match_count int, current_article_id uuid)` returning top matching articles by cosine distance (`1 - (embedding <=> query_embedding)`).

2. **Embedding Generation**:
   - Update `lib/ai/analyzer.ts` to include an `embedText(text: string)` function that outputs a 1536-dimensional vector embedding.
   - Gracefully fallback to dense textual semantic vector embeddings if primary provider API key is missing or quota-limited, ensuring 100% execution reliability.
   - Update `lib/ai/pipeline.ts` to save `embedding` vector array into `article_analyses.embedding`.

3. **Data Access Function**:
   - Add `getRelatedArticles(articleId: string, limit?: number)` to `lib/supabase/data.ts`.
   - Uses Supabase RPC `match_related_articles` or direct vector cosine distance query via Supabase client.

4. **News Details Page UI Integration**:
   - Update `app/article/[id]/page.tsx` to fetch up to 5 related articles for the current article.
   - Render a high-aesthetics **Related Articles** card grid in the news details view with image, source, title, published date, and similarity indicators.

---

## Files to Change / Create
- `supabase/schema.sql` (Updated with `vector` extension, `embedding` column, index, and RPC function)
- `lib/supabase/types.ts` (Updated Database types with `embedding: number[] | null`)
- `lib/supabase/data.ts` (Added `getRelatedArticles` query function)
- `lib/ai/analyzer.ts` (Added text embedding generator)
- `lib/ai/pipeline.ts` (Updated pipeline to store embeddings and update `analyzed_at`)
- `components/article/related-articles.tsx` (NEW: Component rendering related articles)
- `app/article/[id]/page.tsx` (Updated to display related articles section)

---

## Acceptance Criteria
1. `pgvector` extension enabled and `embedding vector(1536)` column added to `article_analyses` in Supabase.
2. `POST /api/analyze` generates and saves embeddings into `article_analyses.embedding`.
3. `getRelatedArticles` retrieves up to 5 similar articles based on cosine vector distance.
4. News details page renders a styled Related Articles section when similar articles exist.
5. `npx tsc --noEmit` completes with 0 errors.

---

## Exact Test Steps
1. Apply ALTER SQL to Supabase project `vmvicejuwxglimrvnodu`.
2. Run `curl.exe -X POST http://localhost:3000/api/analyze -H "Content-Type: application/json" -H "x-biasly-admin-secret: ahsfd459064" -d "{\"limit\": 5}"`.
3. Verify embeddings are populated in Supabase `article_analyses`.
4. Open an article page at `http://localhost:3000/article/<id>` and verify the **Related Articles** section renders live matching stories!
