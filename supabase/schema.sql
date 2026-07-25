-- ==============================================================================
-- biasly (Skew News) - Complete Supabase Database Schema
-- Reference: AGENTS.md Section 7 & Section 20 (pgvector support)
-- ==============================================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  listing_url TEXT NOT NULL UNIQUE,
  parser_strategy TEXT DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL UNIQUE,
  canonical_url TEXT,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  raw_text TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARTICLE_ANALYSES TABLE (with vector embedding column)
CREATE TABLE IF NOT EXISTS public.article_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL UNIQUE REFERENCES public.articles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  sentiment_score NUMERIC(5, 4) NOT NULL CHECK (sentiment_score >= -1.0 AND sentiment_score <= 1.0),
  sentiment_label TEXT NOT NULL CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
  bias_score NUMERIC(5, 4) NOT NULL CHECK (bias_score >= -1.0 AND bias_score <= 1.0),
  bias_label TEXT NOT NULL CHECK (bias_label IN ('left', 'center', 'right', 'mixed', 'unclear')),
  left_percentage INTEGER NOT NULL CHECK (left_percentage >= 0 AND left_percentage <= 100),
  center_percentage INTEGER NOT NULL CHECK (center_percentage >= 0 AND center_percentage <= 100),
  right_percentage INTEGER NOT NULL CHECK (right_percentage >= 0 AND right_percentage <= 100),
  confidence NUMERIC(3, 2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  framing_notes JSONB DEFAULT '[]'::jsonb,
  loaded_terms JSONB DEFAULT '[]'::jsonb,
  disclaimer TEXT,
  model TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sum_percentages_100 CHECK (left_percentage + center_percentage + right_percentage = 100)
);

-- 4. LOGS TABLE
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id TEXT,
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. OXYLABS_SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.oxylabs_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  schedule_id TEXT NOT NULL UNIQUE,
  active_status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. OXYLABS_SCHEDULE_RUNS TABLE
CREATE TABLE IF NOT EXISTS public.oxylabs_schedule_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.oxylabs_schedules(id) ON DELETE CASCADE,
  run_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & COSINE VECTOR SIMILARITY SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_url ON public.articles(url);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON public.articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_analyzed_at ON public.articles(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_article_analyses_article_id ON public.article_analyses(article_id);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON public.sources(is_active);

-- Vector Cosine Distance Index
CREATE INDEX IF NOT EXISTS idx_article_analyses_embedding ON public.article_analyses USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ==============================================================================
-- MATCH RELATED ARTICLES RPC FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.match_related_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.0,
  match_count int DEFAULT 5,
  current_article_id uuid DEFAULT NULL
)
RETURNS TABLE (
  article_id uuid,
  title text,
  image_url text,
  published_at timestamptz,
  source_name text,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id AS article_id,
    a.title,
    a.image_url,
    a.published_at,
    s.name AS source_name,
    (1 - (an.embedding <=> query_embedding))::float AS similarity
  FROM public.article_analyses an
  JOIN public.articles a ON a.id = an.article_id
  JOIN public.sources s ON s.id = a.source_id
  WHERE an.embedding IS NOT NULL
    AND (current_article_id IS NULL OR a.id != current_article_id)
    AND (1 - (an.embedding <=> query_embedding)) > match_threshold
  ORDER BY an.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oxylabs_schedule_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active sources"
  ON public.sources FOR SELECT USING (true);

CREATE POLICY "Allow public read access to articles"
  ON public.articles FOR SELECT USING (true);

CREATE POLICY "Allow public read access to article_analyses"
  ON public.article_analyses FOR SELECT USING (true);
