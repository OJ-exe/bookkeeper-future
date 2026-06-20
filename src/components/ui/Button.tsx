import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "ink" | "bronze" | "outline" | "ghost";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  ink: "bg-fg text-canvas hover:opacity-90",
  bronze: "bg-bronze text-on-bronze hover:opacity-90",
  outline: "bg-surface border border-line text-fg hover:bg-bronze-soft",
  ghost: "text-fg-soft hover:bg-bronze-soft hover:text-bronze",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
};

export default function Button({
  children,
  variant = "ink",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium shadow-[var(--shadow-xs)] transition disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
