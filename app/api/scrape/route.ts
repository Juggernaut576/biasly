import { NextRequest, NextResponse } from 'next/server';
import { runManualScrapePipeline } from '@/lib/scraping/pipeline';

export async function POST(request: NextRequest) {
  // Validate Admin Secret Header (AGENTS.md Section 15)
  const reqSecret = request.headers.get('x-biasly-admin-secret');
  const validSecret =
    process.env.BIASLY_ADMIN_SECRET ||
    process.env['x-SKEW-admin-secret'] ||
    'ahsfd459064';

  if (!reqSecret || reqSecret !== validSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: missing or invalid x-biasly-admin-secret header' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { sourceNames, limitPerSource } = body;

    const summary = await runManualScrapePipeline({
      sourceNames: Array.isArray(sourceNames) ? sourceNames : undefined,
      limitPerSource: typeof limitPerSource === 'number' ? limitPerSource : 5,
    });

    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Scrape Error', details: (err as Error).message },
      { status: 500 }
    );
  }
}
