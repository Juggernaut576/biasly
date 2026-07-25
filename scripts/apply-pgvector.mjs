import { createClient } from '@supabase/supabase-js';
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

const supabaseAdmin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkEmbeddingColumn() {
  const { data, error } = await supabaseAdmin
    .from('article_analyses')
    .select('id, embedding')
    .limit(1);

  if (error) {
    console.log('Embedding column check error:', error.message);
    return false;
  }
  console.log('✅ Embedding column exists in article_analyses table!');
  return true;
}

checkEmbeddingColumn();
