import { Header } from "@/components/layout/header";
import { CategoryBar } from "@/components/layout/category-bar";
import { Footer } from "@/components/layout/footer";
import { HomeNewsCard } from "@/components/ui/home-news-card";
import { mockArticles } from "@/lib/mock-data";
import { getArticles } from "@/lib/supabase/data";

export const revalidate = 0; // Dynamic server rendering for fresh news

export default async function Home() {
  const dbArticles = await getArticles(12);

  // Map database articles to HomeNewsCard format if database articles are present
  const displayArticles =
    dbArticles.length > 0
      ? dbArticles.map((article, idx) => ({
          id: idx + 1,
          dbId: article.id,
          image: article.image_url,
          category: article.source?.name || 'News',
          location: 'Global',
          title: article.title,
          left: article.analysis?.left_percentage ?? 33,
          center: article.analysis?.center_percentage ?? 34,
          right: article.analysis?.right_percentage ?? 33,
          sources: 1,
        }))
      : mockArticles.map(a => ({ ...a, dbId: String(a.id) }));

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Category chips */}
      <CategoryBar />

      {/* Main content */}
      <main className="flex-1 max-w-[var(--container-max)] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Section heading */}
        <h2 className="text-h2 text-[var(--text-primary)] mb-6">Top News</h2>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article) => (
            <HomeNewsCard
              key={article.dbId}
              id={article.dbId as any}
              image={article.image}
              category={article.category}
              location={article.location}
              title={article.title}
              left={article.left}
              center={article.center}
              right={article.right}
              sources={article.sources}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}