interface BiasMeterProps {
  left: number;
  center: number;
  right: number;
  className?: string;
}

export function BiasMeter({ left, center, right, className = "" }: BiasMeterProps) {
  // Ensure percentages sum to 100
  const total = left + center + right;
  const l = total > 0 ? Math.round((left / total) * 100) : 33;
  const c = total > 0 ? Math.round((center / total) * 100) : 34;
  const r = total > 0 ? 100 - l - c : 33;

  return (
    <div className={`w-full ${className}`}>
      {/* Bar */}
      <div className="flex w-full h-[28px] rounded-[var(--radius-full)] overflow-hidden">
        {l > 0 && (
          <div
            className="flex items-center justify-center text-white text-[11px] font-semibold leading-none"
            style={{ width: `${l}%`, backgroundColor: "var(--left-bias)" }}
          >
            Left {l}%
          </div>
        )}
        {c > 0 && (
          <div
            className="flex items-center justify-center text-white text-[11px] font-semibold leading-none"
            style={{ width: `${c}%`, backgroundColor: "var(--center-bias)" }}
          >
            Center {c}%
          </div>
        )}
        {r > 0 && (
          <div
            className="flex items-center justify-center text-white text-[11px] font-semibold leading-none"
            style={{ width: `${r}%`, backgroundColor: "var(--right-bias)" }}
          >
            Right {r}%
          </div>
        )}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-1 text-caption text-[var(--text-secondary)]">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
