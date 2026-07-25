import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/oxylabs/runs
 * Returns recent schedule run logs stored in Supabase
 */
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: runs, error } = await (supabaseAdmin.from('oxylabs_schedule_runs') as any)
      .select('id, run_id, status, error, created_at, oxylabs_schedules(schedule_id, sources(name))')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: runs?.length || 0,
      runs: runs || [],
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
