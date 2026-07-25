import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

envContent.split('\n').forEach((line) => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    process.env[key] = value;
  }
});

const { getArticles, getRelatedArticles } = await import('../lib/supabase/data.ts');

async function testRelated() {
  const articles = await getArticles(5);
  if (articles.length === 0) {
    console.log('No articles found');
    return;
  }

  const target = articles[0];
  console.log(`\nTarget Article: "${target.title}" (ID: ${target.id})`);

  const related = await getRelatedArticles(target.id, 3);
  console.log(`\nFound ${related.length} Related Articles:`);
  related.forEach((r, idx) => {
    console.log(`  [${idx + 1}] "${r.title}" (${r.source?.name})`);
  });
}

testRelated();
