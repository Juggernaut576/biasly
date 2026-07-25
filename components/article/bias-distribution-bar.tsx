import { Info } from "lucide-react";

interface BiasDistributionBarProps {
  left: number;
  center: number;
  right: number;
  sourcesCount: number;
}

export function BiasDistributionBar({
  left,
  center,
  right,
  sourcesCount,
}: BiasDistributionBarProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[var(--radius-md)] p-4 space-y-3">
      {/* Title & Info icon */}
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-primary)]">
        <span>Bias Distribution</span>
        <button aria-label="Bias Distribution info" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Info size={14} />
        </button>
      </div>

      {/* Multi-segment bar */}
      <div className="flex w-full h-8 rounded-[var(--radius-sm)] overflow-hidden text-[12px] font-semibold text-center leading-8 shadow-xs">
        {/* Left segment */}
        <div
          style={{ width: `${left}%` }}
          className="bg-[#B91C1C] text-white flex items-center justify-center min-w-0"
        >
          <span className="truncate px-1">Left {left}%</span>
        </div>

        {/* Center segment */}
        <div
          style={{ width: `${center}%` }}
          className="bg-[#F3F4F6] text-[#111827] flex items-center justify-center min-w-0 border-x border-[#E5E7EB]"
        >
          <span className="truncate px-1">Center {center}%</span>
        </div>

        {/* Right segment */}
        <div
          style={{ width: `${right}%` }}
          className="bg-[#1E3A8A] text-white flex items-center justify-center min-w-0"
        >
          <span className="truncate px-1">Right {right}%</span>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-[12px] font-medium text-[var(--text-secondary)]">
        {sourcesCount} sources
      </div>
    </div>
  );
}
