import { getActiveSources, checkArticleUrlsExist, logMessage } from '../supabase/data';
import { createAdminClient } from '../supabase/server';
import { fetchPageHtml } from './oxylabs';
import { extractHomepageArticleLinks } from './extractor';
import { parseAndValidateArticle } from './validator';

export interface ScrapePipelineOptions {
  sourceNames?: string[];
  limitPerSource?: number;
  runId?: string;
}

export interface ScrapeRunSummary {
  runId: string;
  status: 'completed' | 'failed';
  sourcesChecked: number;
  candidatesFound: number;
  candidatesRejected: number;
  duplicatesSkipped: number;
  detailPagesScraped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
}

export async function runManualScrapePipeline(options: ScrapePipelineOptions = {}): Promise<ScrapeRunSummary> {
  const startTime = Date.now();
  const runId = options.runId || `manual_scrape_${Date.now()}`;
  const limitPerSource = options.limitPerSource || 5;

  const summary: ScrapeRunSummary = {
    runId,
    status: 'completed',
    sourcesChecked: 0,
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
  };

  const addRejection = (reason: string) => {
    summary.rejectionReasons[reason] = (summary.rejectionReasons[reason] || 0) + 1;
  };

  console.log(`\n======================================================`);
  console.log(`🚀 [Scrape Pipeline Started] Run ID: ${runId}`);
  console.log(`======================================================`);

  try {
    // 1. Fetch active sources from Supabase
    let activeSources = await getActiveSources();

    if (options.sourceNames && options.sourceNames.length > 0) {
      const selectedSet = new Set(options.sourceNames.map((s) => s.toLowerCase()));
      activeSources = activeSources.filter((s) => selectedSet.has(s.name.toLowerCase()));
    }

    summary.sourcesChecked = activeSources.length;
    console.log(`[Sources Selected] ${activeSources.length} active source(s): ${activeSources.map((s) => s.name).join(', ')}`);

    if (activeSources.length === 0) {
      console.warn('⚠️ No matching active sources found in Supabase.');
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    const supabaseAdmin = createAdminClient();

    // 2. Iterate through selected sources
    for (const source of activeSources) {
      console.log(`\n------------------------------------------------------`);
      console.log(`📰 [Processing Source] ${source.name} (${source.listing_url})`);

      let homepageHtml = '';
      try {
        homepageHtml = await fetchPageHtml(source.listing_url);
        console.log(`  ✓ Homepage HTML fetched cleanly via Oxylabs (${homepageHtml.length} bytes)`);
      } catch (err) {
        console.error(`  ❌ Failed to fetch homepage HTML for ${source.name}:`, (err as Error).message);
        summary.articlesFailed++;
        addRejection(`Homepage fetch error (${source.name})`);
        continue;
      }

      // 3. Extract candidate story card links
      const candidateLinks = extractHomepageArticleLinks(homepageHtml, source.listing_url);
      summary.candidatesFound += candidateLinks.length;
      console.log(`  ✓ Extracted ${candidateLinks.length} candidate article link(s)`);

      if (candidateLinks.length === 0) {
        console.log(`  ℹ️ No valid candidate links found on ${source.name} homepage.`);
        continue;
      }

      // 4. Perform chunked deduplication check against Supabase (max 15 URLs per chunk)
      const existingUrlsSet = await checkArticleUrlsExist(candidateLinks);
      const newCandidateUrls = candidateLinks.filter((url) => !existingUrlsSet.has(url));

      const duplicatesCount = candidateLinks.length - newCandidateUrls.length;
      summary.duplicatesSkipped += duplicatesCount;
      console.log(`  ✓ Skipped ${duplicatesCount} duplicate URL(s) already in Supabase`);
      console.log(`  ✓ ${newCandidateUrls.length} new candidate URL(s) queued for detail scraping`);

      let sourceInsertedCount = 0;

      // 5. Scrape detail pages up to per-source limit
      for (const candidateUrl of newCandidateUrls) {
        if (sourceInsertedCount >= limitPerSource) {
          console.log(`  🎯 Per-source limit of ${limitPerSource} valid articles reached for ${source.name}. Skipping remaining.`);
          break;
        }

        console.log(`\n  🔎 Detail Scrape: ${candidateUrl}`);
        summary.detailPagesScraped++;

        try {
          const detailHtml = await fetchPageHtml(candidateUrl);
          const validationResult = parseAndValidateArticle(detailHtml, candidateUrl);

          if (!validationResult.isValid) {
            summary.articlesRejected++;
            const reason = validationResult.rejectReason || 'Failed content gate';
            addRejection(reason);
            console.log(`    ❌ Article Rejected: ${reason}`);
            continue;
          }

          // 6. Insert valid article append-only into Supabase
          const { data: insertedArticle, error: insertErr } = await (supabaseAdmin.from('articles') as any)
            .insert({
              source_id: source.id,
              url: candidateUrl,
              canonical_url: validationResult.canonicalUrl || candidateUrl,
              title: validationResult.title,
              image_url: validationResult.imageUrl,
              published_at: validationResult.publishedAt,
              raw_text: validationResult.rawText,
            })
            .select('id')
            .single();

          if (insertErr) {
            console.error(`    ❌ Insert Failed: ${insertErr.message}`);
            summary.articlesFailed++;
            addRejection(`DB insert error (${insertErr.code})`);
          } else {
            sourceInsertedCount++;
            summary.articlesInserted++;
            console.log(`    ✅ Inserted Article [ID: ${insertedArticle?.id}] Title: "${validationResult.title.slice(0, 60)}..."`);
          }
        } catch (err) {
          summary.articlesFailed++;
          const errMsg = (err as Error).message;
          addRejection(`Detail scrape error`);
          console.error(`    ❌ Detail Scrape Failed: ${errMsg}`);
        }
      }
    }
  } catch (err) {
    summary.status = 'failed';
    console.error(`❌ Global pipeline error:`, (err as Error).message);
  }

  summary.totalDurationMs = Date.now() - startTime;

  console.log(`\n======================================================`);
  console.log(`🏁 [Scrape Pipeline Completed] Summary:`);
  console.log(JSON.stringify(summary, null, 2));
  console.log(`======================================================\n`);

  await logMessage(
    runId,
    summary.status === 'completed' ? 'info' : 'error',
    `Scrape pipeline completed in ${summary.totalDurationMs}ms`,
    summary as unknown as Record<string, unknown>
  );

  return summary;
}
