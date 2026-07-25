"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chip } from "@/components/ui/chip";

const categories = [
  "World Cup",
  "IPL",
  "Social Media",
  "Business & Markets",
  "Health & Medicine",
  "Soccer",
  "Artificial Intelligence",
  "Arsenal FC",
  "Extreme Weather and Disasters",
];

export function CategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white border-b border-[var(--border-color)] overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6 flex items-center gap-2 py-2.5">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer text-[var(--text-secondary)]"
          aria-label="Scroll left"
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        {/* Scrollable chip row */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Chip key={cat} label={cat} className="shrink-0" />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer text-[var(--text-secondary)]"
          aria-label="Scroll right"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
