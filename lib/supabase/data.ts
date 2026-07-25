import { createClient } from './client';
import { createAdminClient } from './server';
import type { Source, ArticleWithDetails } from './types';

/**
 * Fetch all active news sources from Supabase
 */
export async function getActiveSources(): Promise<Source[]> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('sources') as any)
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching active sources:', error);
    return [];
  }

  return (data as Source[]) || [];
}

/**
 * Fetch analyzed articles for the homepage grid
 */
export async function getArticles(limit = 12): Promise<ArticleWithDetails[]> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('articles') as any)
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .not('analyzed_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return (data as ArticleWithDetails[]) || [];
}

/**
 * Fetch a single article by ID with full source and analysis details
 */
export async function getArticleById(id: string): Promise<ArticleWithDetails | null> {
  const supabase = createClient();
  const { data, error } = await (supabase.from('articles') as any)
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching article by ID:', error);
    return null;
  }

  return data as ArticleWithDetails;
}

/**
 * Fetch related articles using pgvector cosine similarity search or fallback query
 */
export async function getRelatedArticles(
  currentArticleId: string,
  limit = 5
): Promise<ArticleWithDetails[]> {
  const supabase = createClient();

  // Fetch current article embedding
  const { data: analysisData } = await (supabase.from('article_analyses') as any)
    .select('embedding')
    .eq('article_id', currentArticleId)
    .single();

  if (analysisData && analysisData.embedding) {
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc('match_related_articles', {
      query_embedding: analysisData.embedding,
      match_threshold: 0.0,
      match_count: limit,
      current_article_id: currentArticleId,
    });

    if (!rpcError && rpcData && (rpcData as any[]).length > 0) {
      const relatedIds = (rpcData as any[]).map((r) => r.article_id);
      const { data: fullArticles } = await (supabase.from('articles') as any)
        .select(`
          *,
          source:sources(*),
          analysis:article_analyses(*)
        `)
        .in('id', relatedIds);

      if (fullArticles) {
        return fullArticles as ArticleWithDetails[];
      }
    }
  }

  // Fallback: fetch latest articles excluding current
  const { data: fallbackArticles } = await (supabase.from('articles') as any)
    .select(`
      *,
      source:sources(*),
      analysis:article_analyses(*)
    `)
    .neq('id', currentArticleId)
    .not('analyzed_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  return (fallbackArticles as ArticleWithDetails[]) || [];
}

/**
 * Perform chunked URL existence check (up to 15 URLs per chunk per AGENTS.md rules)
 */
export async function checkArticleUrlsExist(urls: string[]): Promise<Set<string>> {
  if (!urls || urls.length === 0) return new Set();

  const supabase = createClient();
  const existingUrls = new Set<string>();
  const CHUNK_SIZE = 15;

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    const { data, error } = await (supabase.from('articles') as any)
      .select('url')
      .in('url', chunk);

    if (error) {
      console.error('Error in checkArticleUrlsExist chunk:', error);
      continue;
    }

    if (data) {
      (data as any[]).forEach((row) => existingUrls.add(row.url));
    }
  }

  return existingUrls;
}

/**
 * Log system messages to the logs table using service role
 */
export async function logMessage(
  runId: string | null,
  level: 'info' | 'warn' | 'error',
  message: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabaseAdmin = createAdminClient();
    await (supabaseAdmin.from('logs') as any).insert({
      run_id: runId,
      level,
      message,
      metadata: metadata as any,
    });
  } catch (err) {
    console.error('Failed to insert log message to Supabase:', err);
  }
}
