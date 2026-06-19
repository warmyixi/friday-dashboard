import type { QuickAction } from "@/lib/quickActions";

type QuickActionsProps = {
  actions: QuickAction[];
  disabled?: boolean;
  onAction: (message: string) => void;
};

export function QuickActions({ actions, disabled, onAction }: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-3xl lg:px-2">
      <p className="mb-2 text-xs font-medium text-friday-muted">Quick Actions</p>
      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onAction(action.message)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-friday-border bg-friday-panel px-3 py-1.5 text-xs text-friday-text shadow-sm transition hover:border-friday-accent/40 hover:bg-friday-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
