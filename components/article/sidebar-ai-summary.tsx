import { Info } from "lucide-react";

interface SidebarAiSummaryProps {
  bullets: string[];
  generatedDate: string;
  readTime: string;
}

export function SidebarAiSummary({
  bullets,
  generatedDate,
  readTime,
}: SidebarAiSummaryProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[var(--radius-lg)] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
          AI Summary
        </h3>
        <button aria-label="AI Summary info" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Info size={16} />
        </button>
      </div>

      {/* Subtitle */}
      <div className="text-[12px] text-[var(--text-secondary)] font-medium">
        Generated {generatedDate} · {readTime}
      </div>

      {/* Bullets */}
      <ul className="space-y-3 text-[13px] text-[#111827] leading-relaxed list-disc pl-4 marker:text-[var(--text-secondary)]">
        {bullets.map((bullet, index) => (
          <li key={index} className="pl-1">
            {bullet}
          </li>
        ))}
      </ul>

      {/* Disclaimer */}
      <div className="text-[12px] text-[var(--text-secondary)] pt-1">
        AI summaries can make mistakes.
      </div>

      {/* Button */}
      <button className="w-full py-2.5 px-4 rounded-[var(--radius-md)] border border-[#D1D5DB] bg-white text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-center">
        Provide Feedback
      </button>
    </div>
  );
}
