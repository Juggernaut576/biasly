import { NextRequest, NextResponse } from 'next/server';
import { processScheduledResultsPipeline } from '@/lib/scraping/scheduler-pipeline';

function isAuthorized(request: NextRequest): boolean {
  const secretHeader = request.headers.get('x-biasly-admin-secret');
  const validSecret = process.env.BIASLY_ADMIN_SECRET || process.env['x-SKEW-admin-secret'];

  return Boolean(validSecret && secretHeader === validSecret);
}

/**
 * POST /api/oxylabs/scheduled-results/process
 * Manually trigger processing of completed Oxylabs scheduled homepage job results.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Missing or invalid x-biasly-admin-secret header.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limitPerSource = body.limitPerSource || 5;

    const summary = await processScheduledResultsPipeline(limitPerSource);

    return NextResponse.json({
      success: summary.status === 'completed',
      summary,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
