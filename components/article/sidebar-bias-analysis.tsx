import { Info } from "lucide-react";

interface SidebarBiasAnalysisProps {
  overallBiasLabel: string;
  sourcesCount: number;
  leftPercentage: number;
  centerPercentage: number;
  rightPercentage: number;
}

export function SidebarBiasAnalysis({
  overallBiasLabel,
  sourcesCount,
  leftPercentage,
  centerPercentage,
  rightPercentage,
}: SidebarBiasAnalysisProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[var(--radius-lg)] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
          Bias Analysis
        </h3>
        <button aria-label="Bias Analysis info" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Info size={16} />
        </button>
      </div>

      {/* Overall Bias Score */}
      <div className="space-y-1">
        <div className="text-[12px] font-medium text-[var(--text-secondary)]">
          Overall Bias
        </div>
        <div className="text-[26px] font-bold text-[#1E3A8A] tracking-tight leading-none">
          {overallBiasLabel}
        </div>
        <a href="#" className="inline-block text-[12px] font-medium text-[#2563EB] hover:underline">
          Based on {sourcesCount} balanced sources
        </a>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-2.5 pt-1">
        {/* Left */}
        <div className="space-y-1">
          <div className="flex justify-between text-[12px] font-medium">
            <span className="text-[var(--text-secondary)]">Left</span>
            <span className="text-[#B91C1C] font-semibold">{leftPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              style={{ width: `${leftPercentage}%` }}
              className="h-full bg-[#B91C1C] rounded-full"
            />
          </div>
        </div>

        {/* Center */}
        <div className="space-y-1">
          <div className="flex justify-between text-[12px] font-medium">
            <span className="text-[var(--text-secondary)]">Center</span>
            <span className="text-[var(--text-primary)] font-semibold">{centerPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              style={{ width: `${centerPercentage}%` }}
              className="h-full bg-[#9CA3AF] rounded-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-1">
          <div className="flex justify-between text-[12px] font-medium">
            <span className="text-[var(--text-secondary)]">Right</span>
            <span className="text-[#1E3A8A] font-semibold">{rightPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              style={{ width: `${rightPercentage}%` }}
              className="h-full bg-[#1E3A8A] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Explanation Text */}
      <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed pt-1">
        Our analysis is based on the political leaning of the publication and how the story is framed. Sources are weighted by reliability and recency.
      </p>

      {/* Button */}
      <button className="w-full py-2.5 px-4 rounded-[var(--radius-md)] border border-[#D1D5DB] bg-white text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-center">
        How We Analyze Bias
      </button>
    </div>
  );
}
