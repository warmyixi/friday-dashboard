import type { ReactNode } from "react";

type BadgeVariant = "success" | "muted" | "info" | "warn" | "away";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  muted: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  warn: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  away: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({
  children,
  variant = "muted",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
