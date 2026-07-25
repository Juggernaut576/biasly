"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";

interface HomeNewsCardProps {
  id?: number;
  image: string;
  category: string;
  location: string;
  title: string;
  left: number;
  center: number;
  right: number;
  sources: number;
  className?: string;
}

export function HomeNewsCard({
  id = 1,
  image,
  category,
  location,
  title,
  left,
  center,
  right,
  sources,
  className = "",
}: HomeNewsCardProps) {
  return (
    <article
      className={`group bg-white rounded-[var(--radius-lg)] overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-[var(--shadow-md)] ${className}`}
    >
      <Link href={`/article/${id}`} className="block">
        {/* Image with info icon */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <SafeImage
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Info icon overlay */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[var(--text-secondary)] hover:bg-white transition-colors"
            aria-label="More info"
          >
            <Info size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
          {/* Category · Location */}
          <div className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1">
            <span className="font-medium text-[var(--text-primary)]">{category}</span>
            <span>·</span>
            <span>{location}</span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-semibold leading-[1.35] text-[var(--text-primary)] line-clamp-2 min-h-[41px] group-hover:text-[var(--text-secondary)] transition-colors">
            {title}
          </h3>

          {/* Compact bias bar */}
          <div className="flex items-center gap-0 mt-0.5">
            {/* Left pill */}
            <span className="inline-flex items-center justify-center rounded-l-[var(--radius-full)] bg-[var(--left-bias)] text-white text-[11px] font-semibold leading-none px-2 py-[5px] whitespace-nowrap">
              L {left}%
            </span>
            {/* Center text */}
            <span className="flex-1 text-center text-[11px] text-[var(--text-secondary)] font-medium leading-none py-[5px] bg-[var(--bg-secondary)]">
              Center {center}%
            </span>
            {/* Right pill */}
            <span className="inline-flex items-center justify-center rounded-r-[var(--radius-full)] bg-[var(--right-bias)] text-white text-[11px] font-semibold leading-none px-2 py-[5px] whitespace-nowrap">
              Right {right}%
            </span>
          </div>

          {/* Source count */}
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            {sources} sources
          </p>
        </div>
      </Link>
    </article>
  );
}
