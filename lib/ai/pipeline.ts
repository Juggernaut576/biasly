import { createAdminClient } from '../supabase/server';
import { logMessage } from '../supabase/data';
import { analyzeArticleContent, generateTextEmbedding } from './analyzer';

export interface AiAnalysisPipelineOptions {
  batchSize?: number;
  limit?: number;
  articleIds?: string[];
  runId?: string;
}

export interface AiAnalysisRunSummary {
  runId: string;
  status: 'completed' | 'failed';
  totalPending: number;
  analyzedCount: number;
  skippedCount: number;
  failedCount: number;
  totalDurationMs: number;
  model: string;
}

interface PendingArticleRow {
  id: string;
  title: string;
  raw_text: string;
  source_id: string;
}

export async function runAiAnalysisPipeline(
  options: AiAnalysisPipelineOptions = {}
): Promise<AiAnalysisRunSummary> {
  const startTime = Date.now();
  const runId = options.runId || `ai_analysis_${Date.now()}`;
  const batchSize = options.batchSize || 5;

  const summary: AiAnalysisRunSummary = {
    runId,
    status: 'completed',
    totalPending: 0,
    analyzedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    totalDurationMs: 0,
    model: 'llama-3.3-70b-versatile',
  };

  console.log(`\n======================================================`);
  console.log(`🤖 [AI Analysis Pipeline Started] Run ID: ${runId}`);
  console.log(`======================================================`);

  try {
    const supabaseAdmin = createAdminClient();

    let pendingArticles: PendingArticleRow[] = [];

    if (options.articleIds && options.articleIds.length > 0) {
      // Query specific article IDs requested
      const { data, error } = await (supabaseAdmin.from('articles') as any)
        .select('id, title, raw_text, source_id')
        .in('id', options.articleIds);

      if (error) throw new Error(`Pending check failed: ${error.message}`);
      pendingArticles = (data as PendingArticleRow[]) || [];
    } else {
      // Pending-analysis check: LEFT JOIN articles to article_analyses (AGENTS.md Section 19 & 20)
      const { data, error } = await (supabaseAdmin.from('articles') as any)
        .select(`
          id,
          title,
          raw_text,
          source_id,
          article_analyses ( id, embedding )
        `)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Pending check failed: ${error.message}`);

      // Filter to articles missing article_analyses row OR missing embedding
      pendingArticles = (data || [])
        .filter((row: any) => {
          if (!row.article_analyses || row.article_analyses.length === 0) return true;
          const analysis = row.article_analyses[0];
          return !analysis || !analysis.embedding;
        })
        .map((row: any) => ({
          id: row.id,
          title: row.title,
          raw_text: row.raw_text,
          source_id: row.source_id,
        }));
    }

    if (options.limit && options.limit > 0) {
      pendingArticles = pendingArticles.slice(0, options.limit);
    }

    summary.totalPending = pendingArticles.length;
    console.log(`[Pending Articles/Embeddings Detected] Found ${pendingArticles.length} article(s) needing analysis/embedding`);

    if (pendingArticles.length === 0) {
      console.log('✨ All articles are already analyzed with vector embeddings. No work needed.');
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    // Process in batches
    for (let i = 0; i < pendingArticles.length; i += batchSize) {
      const batch = pendingArticles.slice(i, i + batchSize);
      console.log(`\n⚡ Processing Batch ${Math.floor(i / batchSize) + 1} (${batch.length} article(s))...`);

      for (const article of batch) {
        console.log(`  🔎 Processing [ID: ${article.id}] "${article.title.slice(0, 60)}..."`);

        try {
          // 1. Run AI SDK analysis with Groq
          const analysis = await analyzeArticleContent(article.title, article.raw_text);

          // 2. Generate 1536-dim text embedding vector for pgvector
          const embeddingVector = await generateTextEmbedding(`${article.title} ${article.raw_text.slice(0, 1000)}`);

          // Compute derived bias score: (rightPercentage - leftPercentage) / 100
          const derivedBiasScore = Number(((analysis.rightPercentage - analysis.leftPercentage) / 100).toFixed(4));

          // 3. Upsert analysis into article_analyses table with embedding vector
          const { error: upsertErr } = await (supabaseAdmin.from('article_analyses') as any)
            .upsert(
              {
                article_id: article.id,
                summary: analysis.summary,
                sentiment_score: analysis.sentimentScore,
                sentiment_label: analysis.sentimentLabel,
                bias_score: derivedBiasScore,
                bias_label: analysis.biasLabel,
                left_percentage: analysis.leftPercentage,
                center_percentage: analysis.centerPercentage,
                right_percentage: analysis.rightPercentage,
                confidence: analysis.confidence,
                framing_notes: analysis.framingNotes as any,
                loaded_terms: analysis.loadedTerms as any,
                disclaimer: analysis.disclaimer,
                model: summary.model,
                embedding: embeddingVector as any,
              },
              { onConflict: 'article_id' }
            );

          if (upsertErr) {
            console.error(`    ❌ Save analysis failed: ${upsertErr.message}`);
            summary.failedCount++;
            continue;
          }

          // 4. Mark articles.analyzed_at ONLY after analysis & embedding are saved (AGENTS.md Section 20)
          const { error: updateErr } = await (supabaseAdmin.from('articles') as any)
            .update({ analyzed_at: new Date().toISOString() })
            .eq('id', article.id);

          if (updateErr) {
            console.error(`    ⚠️ Failed to update analyzed_at timestamp: ${updateErr.message}`);
          }

          summary.analyzedCount++;
          console.log(`    ✅ Successfully analyzed & saved vector embedding! Framing: ${analysis.biasLabel.toUpperCase()} (L:${analysis.leftPercentage}% C:${analysis.centerPercentage}% R:${analysis.rightPercentage}%)`);
        } catch (err) {
          summary.failedCount++;
          console.error(`    ❌ Pipeline failed for article ${article.id}: ${(err as Error).message}`);
        }
      }
    }
  } catch (err) {
    summary.status = 'failed';
    console.error(`❌ Global AI pipeline error:`, (err as Error).message);
  }

  summary.totalDurationMs = Date.now() - startTime;

  console.log(`\n======================================================`);
  console.log(`🏁 [AI Pipeline Completed] Summary:`);
  console.log(JSON.stringify(summary, null, 2));
  console.log(`======================================================\n`);

  await logMessage(
    runId,
    summary.status === 'completed' ? 'info' : 'error',
    `AI pipeline analyzed ${summary.analyzedCount}/${summary.totalPending} articles with vector embeddings in ${summary.totalDurationMs}ms`,
    summary as unknown as Record<string, unknown>
  );

  return summary;
}
