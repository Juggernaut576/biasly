import { getActiveSources, checkArticleUrlsExist, logMessage } from '../supabase/data';
import { createAdminClient } from '../supabase/server';
import { fetchPageHtml } from './oxylabs';
import { fetchOxylabsScheduleDoneRuns } from './oxylabs-scheduler';
import { extractHomepageArticleLinks } from './extractor';
import { parseAndValidateArticle } from './validator';

export interface ScheduledProcessSummary {
  runId: string;
  status: 'completed' | 'failed';
  schedulesChecked: number;
  homepageRunsProcessed: number;
  candidatesFound: number;
  duplicatesSkipped: number;
  articlesInserted: number;
  articlesRejected: number;
  articlesFailed: number;
  totalDurationMs: number;
  rejectionReasons: Record<string, number>;
}

export async function processScheduledResultsPipeline(limitPerSource = 5): Promise<ScheduledProcessSummary> {
  const startTime = Date.now();
  const runId = `scheduled_process_${Date.now()}`;
  const supabaseAdmin = createAdminClient();

  const summary: ScheduledProcessSummary = {
    runId,
    status: 'completed',
    schedulesChecked: 0,
    homepageRunsProcessed: 0,
    candidatesFound: 0,
    duplicatesSkipped: 0,
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
  console.log(`⏱️ [Scheduled Result Pipeline Started] Run ID: ${runId}`);
  console.log(`======================================================`);

  try {
    // 1. Fetch active schedules from Supabase DB
    const { data: dbSchedules, error: schedErr } = await (supabaseAdmin.from('oxylabs_schedules') as any)
      .select('id, schedule_id, source_id, sources (id, name, listing_url, parser_strategy, is_active)')
      .eq('active_status', true);

    if (schedErr) {
      throw new Error(`Failed to query oxylabs_schedules DB: ${schedErr.message}`);
    }

    const schedulesList = dbSchedules || [];
    summary.schedulesChecked = schedulesList.length;

    console.log(`[Oxylabs Schedules Found] ${schedulesList.length} active schedule(s) stored in Supabase.`);

    if (schedulesList.length === 0) {
      console.warn('⚠️ No active Oxylabs schedules found in Supabase. Run POST /api/oxylabs/schedules first to sync schedules.');
      summary.totalDurationMs = Date.now() - startTime;
      return summary;
    }

    // 2. Iterate through schedules and fetch done runs
    for (const schedRow of schedulesList) {
      const source = schedRow.sources;
      if (!source || !source.is_active) {
        continue;
      }

      console.log(`\n------------------------------------------------------`);
      console.log(`📰 [Processing Scheduled Source] ${source.name} (Schedule ID: ${schedRow.schedule_id})`);

      let doneRuns = [];
      try {
        doneRuns = await fetchOxylabsScheduleDoneRuns(schedRow.schedule_id);
      } catch (err) {
        console.error(`  ❌ Failed to fetch runs for schedule ${schedRow.schedule_id}:`, (err as Error).message);
        continue;
      }

      console.log(`  ✓ Found ${doneRuns.length} completed run(s) on Oxylabs for ${source.name}`);

      let homepageHtml = '';
      if (doneRuns.length > 0 && doneRuns[0].content) {
        homepageHtml = doneRuns[0].content;
        summary.homepageRunsProcessed++;
        console.log(`  ✓ Read homepage HTML from Oxylabs completed run ID ${doneRuns[0].id} (${homepageHtml.length} bytes)`);
      } else {
        // Fallback: If Oxylabs scheduler run content is missing, fetch homepage live
        console.log(`  ℹ️ Completed Oxylabs run content empty. Fetching live homepage HTML fallback via Oxylabs...`);
        try {
          homepageHtml = await fetchPageHtml(source.listing_url);
        } catch (err) {
          console.error(`  ❌ Failed fallback fetch for ${source.name}:`, (err as Error).message);
          continue;
        }
      }

      // 3. Extract candidate article links
      const candidateLinks = extractHomepageArticleLinks(homepageHtml, source.listing_url);
      summary.candidatesFound += candidateLinks.length;
      console.log(`  ✓ Extracted ${candidateLinks.length} candidate article link(s)`);

      if (candidateLinks.length === 0) {
        continue;
      }

      // 4. Chunked deduplication check against Supabase
      const existingUrlsSet = await checkArticleUrlsExist(candidateLinks);
      const newCandidateUrls = candidateLinks.filter((url) => !existingUrlsSet.has(url));

      const duplicatesCount = candidateLinks.length - newCandidateUrls.length;
      summary.duplicatesSkipped += duplicatesCount;
      console.log(`  ✓ Skipped ${duplicatesCount} duplicate URL(s) already in Supabase`);

      let sourceInsertedCount = 0;

      // 5. Scrape detail pages
      for (const candidateUrl of newCandidateUrls) {
        if (sourceInsertedCount >= limitPerSource) {
          break;
        }

        console.log(`\n  🔎 Detail Scrape: ${candidateUrl}`);
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

          // 6. Insert valid article into Supabase
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
            console.log(`    ✅ Inserted Scheduled Article [ID: ${insertedArticle?.id}] Title: "${validationResult.title.slice(0, 60)}..."`);
          }
        } catch (err) {
          summary.articlesFailed++;
          addRejection(`Detail scrape error`);
          console.error(`    ❌ Detail Scrape Failed: ${(err as Error).message}`);
        }
      }

      // Record schedule run in DB
      if (doneRuns.length > 0) {
        await (supabaseAdmin.from('oxylabs_schedule_runs') as any).insert({
          schedule_id: schedRow.id,
          run_id: doneRuns[0].id,
          status: 'processed',
        });
      }
    }
  } catch (err) {
    summary.status = 'failed';
    console.error(`❌ Global scheduled processing error:`, (err as Error).message);
  }

  summary.totalDurationMs = Date.now() - startTime;

  console.log(`\n======================================================`);
  console.log(`🏁 [Scheduled Processing Completed] Summary:`);
  console.log(JSON.stringify(summary, null, 2));
  console.log(`======================================================\n`);

  await logMessage(
    runId,
    summary.status === 'completed' ? 'info' : 'error',
    `Scheduled result processing completed in ${summary.totalDurationMs}ms`,
    summary as unknown as Record<string, unknown>
  );

  return summary;
}
