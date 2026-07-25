import { NextRequest, NextResponse } from 'next/server';
import { getActiveSources } from '@/lib/supabase/data';
import { createAdminClient } from '@/lib/supabase/server';
import {
  createOxylabsSchedule,
  listOxylabsSchedules,
  deactivateOxylabsSchedule,
} from '@/lib/scraping/oxylabs-scheduler';

function isAuthorized(request: NextRequest): boolean {
  const secretHeader = request.headers.get('x-biasly-admin-secret');
  const validSecret = process.env.BIASLY_ADMIN_SECRET || process.env['x-SKEW-admin-secret'];

  return Boolean(validSecret && secretHeader === validSecret);
}

/**
 * GET /api/oxylabs/schedules
 * Returns stored schedule rows from Supabase oxylabs_schedules table
 */
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: dbSchedules, error } = await (supabaseAdmin.from('oxylabs_schedules') as any)
      .select('id, schedule_id, active_status, created_at, updated_at, sources (id, name, listing_url)');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: dbSchedules?.length || 0,
      schedules: dbSchedules || [],
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/**
 * POST /api/oxylabs/schedules
 * Syncs active sources to Oxylabs Scheduler API and deactivates orphan schedules.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized. Missing or invalid x-biasly-admin-secret header.' }, { status: 401 });
  }

  try {
    const activeSources = await getActiveSources();
    if (activeSources.length === 0) {
      return NextResponse.json({ error: 'No active sources found in Supabase' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const syncedSchedules: Array<{ source: string; scheduleId: string }> = [];

    // 1. Create or maintain Oxylabs schedule for each active source
    for (const source of activeSources) {
      try {
        const scheduleId = await createOxylabsSchedule(source.name, source.listing_url);

        // Upsert into oxylabs_schedules table
        await (supabaseAdmin.from('oxylabs_schedules') as any).upsert(
          {
            source_id: source.id,
            schedule_id: scheduleId,
            active_status: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'schedule_id' }
        );

        syncedSchedules.push({ source: source.name, scheduleId });
      } catch (err) {
        console.error(`Failed to sync schedule for source ${source.name}:`, err);
      }
    }

    // 2. Orphan schedule deactivation: compare Oxylabs API schedule list vs DB records
    try {
      const allOxylabsSchedules = await listOxylabsSchedules();
      const validDbScheduleIds = new Set(syncedSchedules.map((s) => s.scheduleId));

      let deactivatedCount = 0;
      for (const oxySched of allOxylabsSchedules) {
        if (oxySched.active && !validDbScheduleIds.has(oxySched.id)) {
          console.log(` Deactivating orphan Oxylabs schedule [ID: ${oxySched.id}]`);
          await deactivateOxylabsSchedule(oxySched.id);
          deactivatedCount++;
        }
      }
      console.log(`✓ Orphan deactivation check completed. Deactivated ${deactivatedCount} orphan schedule(s).`);
    } catch (err) {
      console.error('Warning during orphan schedule deactivation:', err);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedSchedules.length} schedule(s) with Oxylabs.`,
      syncedCount: syncedSchedules.length,
      schedules: syncedSchedules,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
