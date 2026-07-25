interface OxylabsQueryResponse {
  results?: Array<{
    content?: string;
    status_code?: number;
    url?: string;
  }>;
  status?: string;
  error?: string;
}

export async function fetchPageHtml(targetUrl: string, renderHtml = false): Promise<string> {
  const username = process.env.OXY_WSA_USERNAME || process.env.OXYLABS_USERNAME;
  const password = process.env.OXY_WSA_PASSWORD || process.env.OXYLABS_PASSWORD;

  if (!username || !password) {
    throw new Error('Oxylabs credentials (OXY_WSA_USERNAME / OXY_WSA_PASSWORD) missing in environment variables');
  }

  const payload: Record<string, unknown> = {
    source: 'universal',
    url: targetUrl,
  };

  if (renderHtml) {
    payload.render = 'html';
  }

  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Oxylabs API request failed (${response.status}): ${errorText}`);
  }

  const data: OxylabsQueryResponse = await response.json();

  if (!data.results || data.results.length === 0 || !data.results[0].content) {
    throw new Error(`Oxylabs returned empty content for URL: ${targetUrl}`);
  }

  return data.results[0].content;
}
