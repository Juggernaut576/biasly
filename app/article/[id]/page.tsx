import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArticleHeader } from "@/components/article/article-header";
import { ArticleHero } from "@/components/article/article-hero";
import { ArticleBody } from "@/components/article/article-body";
import { SidebarBiasAnalysis } from "@/components/article/sidebar-bias-analysis";
import { SidebarAiSummary } from "@/components/article/sidebar-ai-summary";
import { SidebarSourceBreakdown } from "@/components/article/sidebar-source-breakdown";
import { NewsletterCta } from "@/components/article/newsletter-cta";
import { RelatedArticles } from "@/components/article/related-articles";
import { getArticleDetailById, ArticleDetail } from "@/lib/mock-detail-data";
import { getArticleById, getRelatedArticles } from "@/lib/supabase/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function ArticlePage({ params }: PageProps) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { id } = await params;
  const dbArticle = await getArticleById(id);
  const relatedArticles = await getRelatedArticles(id, 3);

  const fallbackArticle = getArticleDetailById(id);

  const article: ArticleDetail = dbArticle
    ? {
        id: 1,
        image: dbArticle.image_url,
        category: dbArticle.source?.name || 'News',
        location: 'Global',
        title: dbArticle.title,
        left: dbArticle.analysis?.left_percentage ?? 33,
        center: dbArticle.analysis?.center_percentage ?? 34,
        right: dbArticle.analysis?.right_percentage ?? 33,
        sources: 1,
        author: 'biasly AI Pipeline',
        publishedDate: new Date(dbArticle.published_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        readTime: '3 min read',
        imageCaption: dbArticle.title,
        photoCredit: dbArticle.source?.name || 'News Source',
        bodyParagraphs: dbArticle.raw_text ? dbArticle.raw_text.split('\n\n').filter(Boolean) : fallbackArticle.bodyParagraphs,
        quoteText: dbArticle.analysis?.summary || fallbackArticle.quoteText,
        quoteAuthor: 'biasly Neutral Summary',
        aiSummaryBullets: dbArticle.analysis?.summary
          ? dbArticle.analysis.summary.split('. ').map((s) => s.trim()).filter(Boolean)
          : fallbackArticle.aiSummaryBullets,
        aiSummaryDate: 'Just now',
        aiSummaryReadTime: '1 min summary',
        overallBiasScore: String(dbArticle.analysis?.bias_score ?? '0.00'),
        overallBiasLabel: dbArticle.analysis?.bias_label?.toUpperCase() || 'MIXED',
        totalSourcesCount: 1,
        sourcesBreakdown: {
          leftCount: dbArticle.analysis?.left_percentage ? Math.round(dbArticle.analysis.left_percentage / 20) : 1,
          leftPercentage: dbArticle.analysis?.left_percentage ?? 33,
          centerCount: dbArticle.analysis?.center_percentage ? Math.round(dbArticle.analysis.center_percentage / 20) : 1,
          centerPercentage: dbArticle.analysis?.center_percentage ?? 34,
          rightCount: dbArticle.analysis?.right_percentage ? Math.round(dbArticle.analysis.right_percentage / 20) : 1,
          rightPercentage: dbArticle.analysis?.right_percentage ?? 33,
        },
        topSources: [
          {
            name: dbArticle.source?.name || 'Source',
            biasLabel: ((dbArticle.analysis?.bias_label
              ? dbArticle.analysis.bias_label.charAt(0).toUpperCase() + dbArticle.analysis.bias_label.slice(1)
              : 'Center') as any),
          },
        ],
        relatedStories: fallbackArticle.relatedStories,
      }
    : fallbackArticle;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Site Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Article Header Metadata */}
        <ArticleHeader
          category={article.category}
          location={article.location}
          title={article.title}
          author={article.author}
          publishedDate={article.publishedDate}
          readTime={article.readTime}
        />

        {/* Hero Image & Caption */}
        <ArticleHero
          image={article.image}
          title={article.title}
          imageCaption={article.imageCaption}
          photoCredit={article.photoCredit}
        />

        {/* 2-Column Main Section (Article Content vs Sidebar Analysis) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 pt-2">
          {/* Left Column: Article Body, Quotes & Related Stories */}
          <div className="min-w-0 space-y-8">
            <ArticleBody article={article} />

            {/* Related Articles Section (pgvector cosine similarity matched) */}
            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Right Column: Sidebar Analysis Cards */}
          <aside className="space-y-6">
            {/* 1. Overall Bias Analysis */}
            <SidebarBiasAnalysis
              overallBiasLabel={article.overallBiasLabel}
              sourcesCount={article.totalSourcesCount}
              leftPercentage={article.sourcesBreakdown.leftPercentage}
              centerPercentage={article.sourcesBreakdown.centerPercentage}
              rightPercentage={article.sourcesBreakdown.rightPercentage}
            />

            {/* 2. AI Summary */}
            <SidebarAiSummary
              bullets={article.aiSummaryBullets}
              generatedDate={article.aiSummaryDate}
              readTime={article.aiSummaryReadTime}
            />

            {/* 3. Source Breakdown */}
            <SidebarSourceBreakdown
              totalSources={article.totalSourcesCount}
              sourcesBreakdown={article.sourcesBreakdown}
              sources={article.topSources}
            />
          </aside>
        </div>

        {/* Newsletter Subscription Banner */}
        <NewsletterCta />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
