import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 py-2.5 text-[14px] font-medium leading-none transition-colors duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-primary-bg)]";

    const variants: Record<ButtonVariant, string> = {
      primary:
        "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] disabled:cursor-not-allowed",
      secondary:
        "bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] disabled:border-transparent disabled:cursor-not-allowed",
      outline:
        "bg-transparent text-[var(--text-primary)] border border-[var(--btn-secondary-border)] hover:bg-[var(--bg-secondary)] disabled:bg-transparent disabled:text-[var(--btn-disabled-text)] disabled:border-[var(--btn-disabled-bg)] disabled:cursor-not-allowed",
      text: "bg-transparent text-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-hover)] hover:underline disabled:text-[var(--btn-disabled-text)] disabled:no-underline disabled:cursor-not-allowed p-0",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant };
