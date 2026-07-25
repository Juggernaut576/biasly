"use client";

import { SafeImage } from "@/components/ui/safe-image";

interface ArticleHeroProps {
  image: string;
  title: string;
  imageCaption: string;
  photoCredit: string;
}

export function ArticleHero({
  image,
  title,
  imageCaption,
  photoCredit,
}: ArticleHeroProps) {
  return (
    <div className="space-y-2">
      {/* Hero Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <SafeImage
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
      </div>

      {/* Caption & Credit */}
      <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
        <span>{imageCaption} </span>
        <span className="opacity-80">Photo: {photoCredit}</span>
      </div>
    </div>
  );
}
