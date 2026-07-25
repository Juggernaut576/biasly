export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: Source;
        Insert: Omit<Source, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Source>;
      };
      articles: {
        Row: Article;
        Insert: Omit<Article, 'id' | 'scraped_at' | 'created_at'> & {
          id?: string;
          scraped_at?: string;
          created_at?: string;
        };
        Update: Partial<Article>;
      };
      article_analyses: {
        Row: ArticleAnalysis;
        Insert: Omit<ArticleAnalysis, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ArticleAnalysis>;
      };
      logs: {
        Row: Log;
        Insert: Omit<Log, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Log>;
      };
      oxylabs_schedules: {
        Row: OxylabsSchedule;
        Insert: Omit<OxylabsSchedule, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<OxylabsSchedule>;
      };
      oxylabs_schedule_runs: {
        Row: OxylabsScheduleRun;
        Insert: Omit<OxylabsScheduleRun, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OxylabsScheduleRun>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface Source {
  id: string;
  name: string;
  listing_url: string;
  parser_strategy: string;
  is_active: boolean;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  source_id: string;
  url: string;
  canonical_url: string | null;
  title: string;
  image_url: string;
  published_at: string;
  raw_text: string;
  scraped_at: string;
  analyzed_at: string | null;
  created_at: string;
}

export interface FramingNote {
  perspective: string;
  description: string;
  example: string;
}

export interface LoadedTerm {
  term: string;
  biasType: string;
  context: string;
}

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: 'positive' | 'neutral' | 'negative';
  bias_score: number;
  bias_label: 'left' | 'center' | 'right' | 'mixed' | 'unclear';
  left_percentage: number;
  center_percentage: number;
  right_percentage: number;
  confidence: number;
  framing_notes: FramingNote[] | Json;
  loaded_terms: LoadedTerm[] | Json;
  disclaimer: string | null;
  model: string;
  embedding?: number[] | string | null;
  created_at: string;
}

export interface Log {
  id: string;
  run_id: string | null;
  level: string;
  message: string;
  metadata: Json;
  created_at: string;
}

export interface OxylabsSchedule {
  id: string;
  source_id: string;
  schedule_id: string;
  active_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface OxylabsScheduleRun {
  id: string;
  schedule_id: string;
  run_id: string;
  status: string;
  error: string | null;
  created_at: string;
}

export interface ArticleWithDetails extends Article {
  source: Source;
  analysis?: ArticleAnalysis | null;
}

export interface RelatedArticleResult {
  article_id: string;
  title: string;
  image_url: string;
  published_at: string;
  source_name: string;
  similarity: number;
}
