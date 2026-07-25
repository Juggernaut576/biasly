import { ArticleDetail } from "@/lib/mock-detail-data";
import { BiasDistributionBar } from "./bias-distribution-bar";
import { RelatedStories } from "./related-stories";

interface ArticleBodyProps {
  article: ArticleDetail;
}

export function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <div className="space-y-6">
      {/* Inline Bias Distribution Bar */}
      <BiasDistributionBar
        left={article.left}
        center={article.center}
        right={article.right}
        sourcesCount={article.totalSourcesCount}
      />

      {/* Main Paragraphs */}
      <div className="text-[15px] leading-[1.75] text-[#111827] space-y-5">
        {article.bodyParagraphs.slice(0, 2).map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        {/* Quote Block */}
        {article.quoteText && (
          <blockquote className="my-6 pl-4 border-l-2 border-[#111827] italic text-[15px] font-normal text-[#111827] space-y-1">
            <p className="leading-relaxed">&ldquo;{article.quoteText}&rdquo;</p>
            {article.quoteAuthor && (
              <cite className="block not-italic text-[12px] font-medium text-[var(--text-secondary)]">
                — {article.quoteAuthor}
              </cite>
            )}
          </blockquote>
        )}

        {/* Remaining Paragraphs */}
        {article.bodyParagraphs.slice(2).map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Related Stories */}
      <RelatedStories stories={article.relatedStories} />
    </div>
  );
}
