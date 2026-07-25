import { NextRequest, NextResponse } from 'next/server';
import { processScheduledResultsPipeline } from '@/lib/scraping/scheduler-pipeline';
import { runAiAnalysisPipeline } from '@/lib/ai/pipeline';
import { logMessage } from '@/lib/supabase/data';

/**
 * GET /api/cron/pipeline
 * Internal Vercel Cron route. Triggers scheduled result processing + AI analysis sequentially.
 * Protected by CRON_SECRET in production. Bypassed in local development.
 */
export async function GET(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production';
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;

  if (isProd && expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
  }

  const runId = `cron_pipeline_${Date.now()}`;
  console.log(`\n======================================================`);
  console.log(`⏰ [Vercel Cron Pipeline Triggered] Run ID: ${runId}`);
  console.log(`======================================================`);

  let scrapeSummary = null;
  let scrapeError = null;
  let aiSummary = null;
  let aiError = null;

  // Step 1: Scheduled Result Processing
  try {
    console.log('▶️ Step 1/2: Processing Oxylabs scheduled homepage results...');
    scrapeSummary = await processScheduledResultsPipeline(5);
  } catch (err) {
    scrapeError = (err as Error).message;
    console.error('❌ Step 1 failed:', scrapeError);
  }

  // Step 2: AI Analysis (runs even if Step 1 failed per AGENTS.md Section 18)
  try {
    console.log('\n▶️ Step 2/2: Running AI analysis on pending articles...');
    aiSummary = await runAiAnalysisPipeline();
  } catch (err) {
    aiError = (err as Error).message;
    console.error('❌ Step 2 failed:', aiError);
  }

  const overallStatus = scrapeError || aiError ? 'partial_failure' : 'completed';

  await logMessage(
    runId,
    overallStatus === 'completed' ? 'info' : 'warn',
    `Automatic Cron Pipeline executed. Status: ${overallStatus}`,
    { scrapeSummary, scrapeError, aiSummary, aiError }
  );

  return NextResponse.json({
    success: overallStatus === 'completed',
    runId,
    status: overallStatus,
    step1_scrape: scrapeSummary || { error: scrapeError },
    step2_ai_analysis: aiSummary || { error: aiError },
  });
}
