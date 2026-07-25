import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { ArticleAnalysisSchema, StructuredArticleAnalysis } from './analysis-schema';

export async function analyzeArticleContent(
  title: string,
  rawText: string
): Promise<StructuredArticleAnalysis> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  const groq = createGroq({ apiKey });

  // Truncate raw text to ~6000 characters if very long
  const textSnippet = rawText.length > 6000 ? rawText.slice(0, 6000) + '...' : rawText;

  const prompt = `
You are a senior media bias analyst and linguistic analyst for biasly (Skew News).
Analyze the following news article for political framing, language sentiment, and loaded vocabulary strictly based on textual evidence.

Respond strictly with a valid JSON object matching this schema:
{
  "summary": "Objective, factual 2-3 sentence summary of the article without commentary",
  "sentimentScore": 0.05, // number from -1.0 to 1.0
  "sentimentLabel": "neutral", // "positive" | "neutral" | "negative"
  "leftPercentage": 25, // integer 0 to 100
  "centerPercentage": 50, // integer 0 to 100
  "rightPercentage": 25, // integer 0 to 100 (leftPercentage + centerPercentage + rightPercentage MUST equal 100)
  "biasLabel": "center", // "left" | "center" | "right" | "mixed" | "unclear"
  "confidence": 0.85, // number 0.0 to 1.0
  "framingNotes": [
    {
      "perspective": "Official Body",
      "description": "Article relies primarily on official White House announcements",
      "example": "Direct quote or paraphrase from text"
    }
  ],
  "loadedTerms": [
    {
      "term": "tougher terms",
      "biasType": "Emotive",
      "context": "Context sentence showing how term was used"
    }
  ],
  "disclaimer": "Political framing is AI-estimated based strictly on article text evidence."
}

Article Title: "${title}"

Article Text:
${textSnippet}
`;

  const { text } = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    prompt,
  });

  const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const rawObj = JSON.parse(jsonString);

  // Normalize percentages to sum to 100
  const left = typeof rawObj.leftPercentage === 'number' ? Math.max(0, Math.min(100, Math.round(rawObj.leftPercentage))) : 33;
  const center = typeof rawObj.centerPercentage === 'number' ? Math.max(0, Math.min(100, Math.round(rawObj.centerPercentage))) : 34;
  let right = typeof rawObj.rightPercentage === 'number' ? Math.max(0, Math.min(100, Math.round(rawObj.rightPercentage))) : 33;

  const total = left + center + right;
  if (total !== 100) {
    right = 100 - left - center;
  }

  const normalizedObj = {
    summary: rawObj.summary || 'Article summary unavailable.',
    sentimentScore: typeof rawObj.sentimentScore === 'number' ? rawObj.sentimentScore : 0,
    sentimentLabel: ['positive', 'neutral', 'negative'].includes(rawObj.sentimentLabel) ? rawObj.sentimentLabel : 'neutral',
    leftPercentage: left,
    centerPercentage: center,
    rightPercentage: Math.max(0, right),
    biasLabel: ['left', 'center', 'right', 'mixed', 'unclear'].includes(rawObj.biasLabel) ? rawObj.biasLabel : 'mixed',
    confidence: typeof rawObj.confidence === 'number' ? rawObj.confidence : 0.8,
    framingNotes: Array.isArray(rawObj.framingNotes) && rawObj.framingNotes.length > 0 ? rawObj.framingNotes : [
      { perspective: 'Mainstream', description: 'Standard reporting style', example: title }
    ],
    loadedTerms: Array.isArray(rawObj.loadedTerms) ? rawObj.loadedTerms : [],
    disclaimer: rawObj.disclaimer || 'Political framing is AI-estimated based strictly on article text evidence.',
  };

  return ArticleAnalysisSchema.parse(normalizedObj);
}

/**
 * Generate a 1536-dimensional vector embedding for article text.
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  const DIMENSIONS = 1536;
  const vector = new Array(DIMENSIONS).fill(0);

  // Clean text and extract word tokens
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length === 0) return vector;

  // Deterministic feature projection into 1536 dimensions
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash1 = 5381;
    let hash2 = 0;

    for (let c = 0; c < word.length; c++) {
      const code = word.charCodeAt(c);
      hash1 = (hash1 * 33) ^ code;
      hash2 = (hash2 * 31) + code;
    }

    const idx1 = Math.abs(hash1) % DIMENSIONS;
    const idx2 = Math.abs(hash2) % DIMENSIONS;
    const weight = 1.0 / (1.0 + Math.log(i + 1));

    vector[idx1] += weight;
    vector[idx2] -= weight * 0.5;
  }

  // L2 Norm normalization
  let sumSq = 0;
  for (let i = 0; i < DIMENSIONS; i++) {
    sumSq += vector[i] * vector[i];
  }

  const norm = Math.sqrt(sumSq) || 1.0;
  return vector.map((v) => Number((v / norm).toFixed(6)));
}
