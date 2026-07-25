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

const { runAiAnalysisPipeline } = await import('../lib/ai/pipeline.ts');

async function testPipeline() {
  console.log('Testing AI Analysis & Vector Embedding Pipeline...');
  const res = await runAiAnalysisPipeline({ limit: 5 });
  console.log('Pipeline Result:', res);
}

testPipeline();
