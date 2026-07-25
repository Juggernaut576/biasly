import { z } from 'zod';

export const FramingNoteSchema = z.object({
  perspective: z.string().describe('The perspective or slant represented (e.g. Left, Right, Official Body)'),
  description: z.string().describe('Concise analysis of how this framing choice shapes reader perception'),
  example: z.string().describe('Direct quote or specific paraphrase from the article illustrating this framing'),
});

export const LoadedTermSchema = z.object({
  term: z.string().describe('Specific word or phrase with emotive/biased connotation used in the text'),
  biasType: z.string().describe('Type of bias or tone (e.g. Sensational, Emotive, Dismissive, Favorable)'),
  context: z.string().describe('Contextual sentence showing how the term was deployed'),
});

export const ArticleAnalysisSchema = z.object({
  summary: z.string().describe('Objective, factual 2-3 sentence summary of the article without commentary'),
  sentimentScore: z.number().min(-1.0).max(1.0).describe('Overall sentiment score from -1.0 (strongly negative) to 1.0 (strongly positive)'),
  sentimentLabel: z.enum(['positive', 'neutral', 'negative']).describe('Categorical sentiment classification'),
  leftPercentage: z.number().int().min(0).max(100).describe('Estimated percentage of left-leaning framing (0 to 100)'),
  centerPercentage: z.number().int().min(0).max(100).describe('Estimated percentage of neutral/center framing (0 to 100)'),
  rightPercentage: z.number().int().min(0).max(100).describe('Estimated percentage of right-leaning framing (0 to 100)'),
  biasLabel: z.enum(['left', 'center', 'right', 'mixed', 'unclear']).describe('Primary political framing label'),
  confidence: z.number().min(0.0).max(1.0).describe('AI confidence score in its framing evaluation (0.0 to 1.0)'),
  framingNotes: z.array(FramingNoteSchema).min(1).describe('Key structural framing choices identified in the text'),
  loadedTerms: z.array(LoadedTermSchema).describe('Emotive or loaded terms identified in the article'),
  disclaimer: z.string().default('Political framing is AI-estimated based strictly on article text evidence.'),
});

export type StructuredArticleAnalysis = z.infer<typeof ArticleAnalysisSchema>;
