import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach((line) => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
});

const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

async function runPgVectorSetup() {
  const sql = `
    CREATE EXTENSION IF NOT EXISTS vector;
    ALTER TABLE public.article_analyses ADD COLUMN IF NOT EXISTS embedding vector(1536);
  `;

  console.log('Sending DDL query to Supabase endpoint...');
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  const responseText = await res.text();
  console.log('Response:', res.status, responseText);
}

runPgVectorSetup();
