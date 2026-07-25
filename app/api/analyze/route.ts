import { NextRequest, NextResponse } from 'next/server';
import { runAiAnalysisPipeline } from '@/lib/ai/pipeline';

export async function POST(request: NextRequest) {
  // Validate Admin Secret Header (AGENTS.md Section 15 & 19)
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
    const { limit, batchSize, articleIds } = body;

    const summary = await runAiAnalysisPipeline({
      limit: typeof limit === 'number' ? limit : undefined,
      batchSize: typeof batchSize === 'number' ? batchSize : 5,
      articleIds: Array.isArray(articleIds) ? articleIds : undefined,
    });

    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal AI Analysis Error', details: (err as Error).message },
      { status: 500 }
    );
  }
}
