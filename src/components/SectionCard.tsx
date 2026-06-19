import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  icon?: string;
  count?: number;
  error?: string | null;
  className?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  icon,
  count,
  error,
  className = "",
  children,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-friday-border-subtle bg-friday-panel shadow-card ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-friday-border-subtle px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-friday-text">
          {icon ? <span aria-hidden>{icon}</span> : null}
          <span>{title}</span>
          {typeof count === "number" ? (
            <span className="rounded-full bg-friday-elevated px-2 py-0.5 text-xs font-normal text-friday-muted">
              {count}
            </span>
          ) : null}
        </h2>
        {error ? (
          <span className="text-xs text-friday-danger">讀取失敗</span>
        ) : null}
      </div>
      <div className="p-4">
        {error ? (
          <p className="text-sm text-friday-muted">{error}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
