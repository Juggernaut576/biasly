import Image from "next/image";
import Link from "next/link";
import { RelatedStory } from "@/lib/mock-detail-data";

interface RelatedStoriesProps {
  stories: RelatedStory[];
}

export function RelatedStories({ stories }: RelatedStoriesProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
      <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
        Related Stories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/article/${story.id}`}
            className="flex items-start gap-3 p-2 rounded-[var(--radius-md)] hover:bg-[var(--bg-secondary)] transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative shrink-0 w-20 h-20 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="80px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                {story.category} · {story.location}
              </div>
              <h3 className="text-[13px] font-bold text-[var(--text-primary)] leading-[1.3] line-clamp-2 group-hover:text-[var(--text-secondary)] transition-colors">
                {story.title}
              </h3>
              <div className="text-[11px] text-[var(--text-secondary)] pt-0.5">
                {story.date} · {story.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
