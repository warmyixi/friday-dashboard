import { Spinner } from "@/components/ui/Spinner";

export function ThinkingIndicator() {
  return (
    <div className="animate-fade-in flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-friday-accent/15 text-xs font-semibold text-friday-accent">
        F
      </div>
      <div className="rounded-2xl border border-friday-border-subtle bg-friday-elevated/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Spinner size="sm" />
          <span className="text-sm text-friday-muted">Friday 思考中</span>
          <span className="flex items-center gap-1">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-friday-muted" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-friday-muted" />
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-friday-muted" />
          </span>
        </div>
      </div>
    </div>
  );
}
