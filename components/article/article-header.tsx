import { Bookmark, Share2, MoreHorizontal } from "lucide-react";

interface ArticleHeaderProps {
  category: string;
  location: string;
  title: string;
  author: string;
  publishedDate: string;
  readTime: string;
}

export function ArticleHeader({
  category,
  location,
  title,
  author,
  publishedDate,
  readTime,
}: ArticleHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Category & Location */}
      <div className="text-[12px] font-semibold text-[var(--text-secondary)] tracking-wide">
        {category} · {location}
      </div>

      {/* Main Title */}
      <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[var(--text-primary)] leading-[1.2] tracking-[-0.01em]">
        {title}
      </h1>

      {/* Byline and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-2 border-b border-[var(--border-color)]">
        {/* Left: Author, Date, Read time */}
        <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">By {author}</span>
          <span>|</span>
          <span>{publishedDate}</span>
          <span>|</span>
          <span>{readTime}</span>
        </div>

        {/* Right: Actions (Save, Share, More) */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
            <span>Save</span>
            <Bookmark size={14} className="text-[var(--text-secondary)]" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
            <span>Share</span>
            <Share2 size={14} className="text-[var(--text-secondary)]" />
          </button>
          <button className="p-1.5 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer" aria-label="More options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
