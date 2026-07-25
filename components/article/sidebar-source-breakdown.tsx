import { Info } from "lucide-react";
import { SourceItem } from "@/lib/mock-detail-data";

interface SidebarSourceBreakdownProps {
  totalSources: number;
  sourcesBreakdown: {
    leftCount: number;
    leftPercentage: number;
    centerCount: number;
    centerPercentage: number;
    rightCount: number;
    rightPercentage: number;
  };
  sources: SourceItem[];
}

export function SidebarSourceBreakdown({
  totalSources,
  sourcesBreakdown,
  sources,
}: SidebarSourceBreakdownProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[var(--radius-lg)] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
          Source Breakdown
        </h3>
        <button aria-label="Source Breakdown info" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Info size={16} />
        </button>
      </div>

      {/* Subtitle */}
      <div className="text-[12px] font-bold text-[var(--text-primary)]">
        {totalSources} Total Sources
      </div>

      {/* Distribution Bars */}
      <div className="space-y-2 pt-1">
        {/* Left */}
        <div className="flex items-center justify-between text-[12px] font-medium">
          <span className="w-16 text-[var(--text-secondary)]">Left</span>
          <span className="w-20 text-[var(--text-secondary)]">
            {sourcesBreakdown.leftCount} ({sourcesBreakdown.leftPercentage}%)
          </span>
          <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden ml-2">
            <div
              style={{ width: `${sourcesBreakdown.leftPercentage}%` }}
              className="h-full bg-[#B91C1C] rounded-full"
            />
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-between text-[12px] font-medium">
          <span className="w-16 text-[var(--text-secondary)]">Center</span>
          <span className="w-20 text-[var(--text-secondary)]">
            {sourcesBreakdown.centerCount} ({sourcesBreakdown.centerPercentage}%)
          </span>
          <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden ml-2">
            <div
              style={{ width: `${sourcesBreakdown.centerPercentage}%` }}
              className="h-full bg-[#9CA3AF] rounded-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center justify-between text-[12px] font-medium">
          <span className="w-16 text-[var(--text-secondary)]">Right</span>
          <span className="w-20 text-[var(--text-secondary)]">
            {sourcesBreakdown.rightCount} ({sourcesBreakdown.rightPercentage}%)
          </span>
          <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden ml-2">
            <div
              style={{ width: `${sourcesBreakdown.rightPercentage}%` }}
              className="h-full bg-[#1E3A8A] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Sources List Header */}
      <div className="flex justify-between text-[12px] font-bold text-[var(--text-secondary)] pt-2 border-t border-[#E5E7EB]">
        <span>Top Sources</span>
        <span>Bias</span>
      </div>

      {/* Sources List */}
      <div className="space-y-2">
        {sources.map((source, index) => {
          const biasColorClass =
            source.biasLabel === "Left"
              ? "text-[#B91C1C]"
              : source.biasLabel === "Right"
              ? "text-[#1E3A8A]"
              : "text-[var(--text-secondary)]";

          return (
            <div
              key={index}
              className="flex justify-between items-center text-[13px]"
            >
              <span className="font-semibold text-[var(--text-primary)]">
                {source.name}
              </span>
              <span className={`font-medium ${biasColorClass}`}>
                {source.biasLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <button className="w-full py-2.5 px-4 rounded-[var(--radius-md)] border border-[#D1D5DB] bg-white text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-center mt-2">
        View All Sources
      </button>
    </div>
  );
}
