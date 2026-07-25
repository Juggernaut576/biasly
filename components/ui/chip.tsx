import { X } from "lucide-react";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  className?: string;
}

export function Chip({ label, onRemove, active = false, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border px-3 py-1.5 text-[13px] font-medium leading-none transition-colors duration-150 select-none
        ${active
          ? "bg-[var(--btn-primary-bg)] text-white border-transparent"
          : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
        }
        ${className}`}
    >
      {label}
      {onRemove ? (
        <button
          onClick={onRemove}
          className="flex items-center justify-center rounded-full hover:bg-black/10 p-0.5 transition-colors cursor-pointer"
          aria-label={`Remove ${label}`}
        >
          <X size={12} strokeWidth={2} />
        </button>
      ) : (
        <span className="text-[11px] opacity-60">+</span>
      )}
    </span>
  );
}
