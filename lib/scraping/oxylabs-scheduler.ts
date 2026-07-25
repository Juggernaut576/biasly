/**
 * Oxylabs Scheduler API integration helper
 * Handles schedule creation, listing, run fetching, and orphan deactivation.
 * AGENTS.md Section 18 compliant: Extract 64-bit IDs from raw text before JSON.parse
 */

interface ScheduleCreatePayload {
  title: string;
  cron: string;
  end_time: string;
  items: Array<{
    source: string;
    url: string;
  }>;
}

export interface OxylabsScheduleItem {
  id: string; // Stored as string to preserve 64-bit integer precision
  title?: string;
  url?: string;
  status?: string;
  active?: boolean;
  cron?: string;
}

export interface OxylabsRunItem {
  id: string; // Run ID or Job ID as string
  schedule_id: string;
  result_status?: string; // 'done', 'pending', 'faulted'
  created_at?: string;
  content?: string;
}

function getAuthHeader(): string {
  const username = process.env.OXY_WSA_USERNAME || process.env.OXYLABS_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD || process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    throw new Error('Oxylabs credentials (OXY_WSA_USERNAME / OXY_WSA_PASSWORD) missing');
  }

  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

/**
 * Creates or updates an Oxylabs Scheduler job for a target homepage URL.
 */
export async function createOxylabsSchedule(sourceName: string, homepageUrl: string): Promise<string> {
  const authHeader = getAuthHeader();
  const payload: ScheduleCreatePayload = {
    title: `biasly - ${sourceName} Homepage Scrape`,
    cron: '0 * * * *', // Hourly top of every hour
    end_time: '2028-12-31T23:59:59Z',
    items: [
      {
        source: 'universal',
        url: homepageUrl,
      },
    ],
  };

  const endpoint = 'https://realtime.oxylabs.io/v1/schedules';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Oxylabs Schedule creation failed (${response.status}): ${responseText}`);
  }

  // Extract ID directly from raw text before JSON.parse to prevent Number 64-bit precision loss
  const idMatch = responseText.match(/"schedule_id"\s*:\s*(\d+)/) || responseText.match(/"id"\s*:\s*(\d+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  const parsed = JSON.parse(responseText);
  const parsedId = String(parsed.schedule_id || parsed.id || '');
  if (!parsedId) {
    throw new Error(`Oxylabs schedule response missing ID: ${responseText}`);
  }
  return parsedId;
}

/**
 * Lists all schedules currently active on Oxylabs
 */
export async function listOxylabsSchedules(): Promise<OxylabsScheduleItem[]> {
  const authHeader = getAuthHeader();
  const endpoint = 'https://realtime.oxylabs.io/v1/schedules';

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    return [];
  }

  const rawText = await response.text();
  const parsed = JSON.parse(rawText);
  const items: OxylabsScheduleItem[] = [];

  const rawSchedules = Array.isArray(parsed) ? parsed : (parsed.schedules || parsed.results || []);

  for (const item of rawSchedules) {
    const rawIdMatch = rawText.match(new RegExp(`"(?:schedule_id|id)"\\s*:\\s*(${item.schedule_id || item.id})`));
    const strId = rawIdMatch ? rawIdMatch[1] : String(item.schedule_id || item.id || '');

    items.push({
      id: strId,
      title: item.title || item.name,
      url: item.items?.[0]?.url || item.url,
      status: item.status || (item.active !== false ? 'active' : 'inactive'),
      active: item.active !== false,
      cron: item.cron,
    });
  }

  return items;
}

/**
 * Deactivates an Oxylabs schedule by ID
 */
export async function deactivateOxylabsSchedule(scheduleId: string): Promise<boolean> {
  const authHeader = getAuthHeader();
  const endpoint = `https://realtime.oxylabs.io/v1/schedules/${scheduleId}/state`;

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ state: 'inactive', active: false }),
    });

    return response.ok;
  } catch (err) {
    console.error(`Error deactivating Oxylabs schedule ${scheduleId}:`, err);
    return false;
  }
}

/**
 * Fetches completed runs for a schedule ID using /runs endpoint
 * Returns only runs with result_status === 'done'
 */
export async function fetchOxylabsScheduleDoneRuns(scheduleId: string): Promise<OxylabsRunItem[]> {
  const authHeader = getAuthHeader();
  const endpoint = `https://realtime.oxylabs.io/v1/schedules/${scheduleId}/runs`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    return [];
  }

  const rawText = await response.text();
  const parsed = JSON.parse(rawText);
  const runsArray = Array.isArray(parsed) ? parsed : (parsed.runs || parsed.results || []);

  const doneRuns: OxylabsRunItem[] = [];

  for (const run of runsArray) {
    const status = run.result_status || run.status;
    if (status === 'done' || status === 'completed') {
      const rawRunIdMatch = rawText.match(new RegExp(`"id"\\s*:\\s*(${run.id})`));
      const strRunId = rawRunIdMatch ? rawRunIdMatch[1] : String(run.id || '');

      doneRuns.push({
        id: strRunId,
        schedule_id: scheduleId,
        result_status: 'done',
        created_at: run.created_at || run.updated_at,
        content: run.content || run.result?.content || run.results?.[0]?.content,
      });
    }
  }

  return doneRuns;
}
