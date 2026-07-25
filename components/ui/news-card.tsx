import Image from "next/image";
import { Clock, BookOpen } from "lucide-react";

interface NewsCardProps {
  image: string;
  category: string;
  source: string;
  title: string;
  description: string;
  left: number;
  center: number;
  right: number;
  timeAgo: string;
  readTime: string;
  className?: string;
}

export function NewsCard({
  image,
  category,
  source,
  title,
  description,
  left,
  center,
  right,
  timeAgo,
  readTime,
  className = "",
}: NewsCardProps) {
  return (
    <div
      className={`group rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--bg-primary)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200 cursor-pointer ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category · Source */}
        <div className="text-caption text-[var(--text-secondary)] flex items-center gap-1.5">
          <span className="font-medium text-[var(--text-primary)]">{category}</span>
          <span>·</span>
          <span>{source}</span>
        </div>

        {/* Title */}
        <h3 className="text-h3 text-[var(--text-primary)] line-clamp-2">{title}</h3>

        {/* Description */}
        <p className="text-body-sm text-[var(--text-secondary)] line-clamp-2">{description}</p>

        {/* Bias pills */}
        <div className="flex items-center gap-1.5">
          <span className="bias-left rounded-[var(--radius-full)] px-2.5 py-1 text-[11px] font-semibold leading-none">
            Left {left}%
          </span>
          <span className="bias-center rounded-[var(--radius-full)] px-2.5 py-1 text-[11px] font-semibold leading-none">
            Center {center}%
          </span>
          <span className="bias-right rounded-[var(--radius-full)] px-2.5 py-1 text-[11px] font-semibold leading-none">
            Right {right}%
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-caption text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} strokeWidth={2} />
            {timeAgo}
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen size={12} strokeWidth={2} />
            {readTime}
          </span>
        </div>
      </div>
    </div>
  );
}
