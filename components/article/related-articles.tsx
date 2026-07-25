import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import type { ArticleWithDetails } from '@/lib/supabase/types';

interface RelatedArticlesProps {
  articles: ArticleWithDetails[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[var(--border-subtle)] pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Related News & Semantic Matches
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Articles matched using pgvector cosine similarity search
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
          pgvector matched
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((item) => {
          const left = item.analysis?.left_percentage ?? 33;
          const center = item.analysis?.center_percentage ?? 34;
          const right = item.analysis?.right_percentage ?? 33;

          return (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group flex flex-col bg-white border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail Image */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <SafeImage
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {item.source?.name || 'News Source'}
                  </span>
                  <span>
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                  {item.title}
                </h4>

                {/* Bias Bar */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="flex h-2 w-full rounded-full overflow-hidden mb-1">
                    <div style={{ width: `${left}%` }} className="bg-blue-600" />
                    <div style={{ width: `${center}%` }} className="bg-gray-400" />
                    <div style={{ width: `${right}%` }} className="bg-red-600" />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-gray-500">
                    <span className="text-blue-600">L {left}%</span>
                    <span>C {center}%</span>
                    <span className="text-red-600">R {right}%</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
