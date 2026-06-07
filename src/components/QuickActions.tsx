type QuickAction = {
  id: string;
  label: string;
  icon: string;
  message: string;
};

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "lamp-on", label: "開燈", icon: "💡", message: "開啟主臥站立燈" },
  { id: "lamp-off", label: "關燈", icon: "💡", message: "關閉主臥站立燈" },
  { id: "fan-on", label: "開風扇", icon: "🌀", message: "開啟主臥風扇" },
  { id: "fan-off", label: "關風扇", icon: "🌀", message: "關閉主臥風扇" },
  { id: "ac-on", label: "開冷氣", icon: "❄️", message: "開啟主臥冷氣" },
  { id: "ac-off", label: "關冷氣", icon: "❄️", message: "關閉主臥冷氣" },
  { id: "arrival", label: "到家模式", icon: "🏠", message: "到家模式" },
  { id: "away", label: "離家模式", icon: "🚗", message: "我要出門" },
  { id: "refresh", label: "刷新", icon: "🔄", message: "查詢主臥設備狀態" },
];

type QuickActionsProps = {
  disabled?: boolean;
  onAction: (message: string) => void;
};

export function QuickActions({ disabled, onAction }: QuickActionsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl lg:px-2">
      <p className="mb-2 text-xs font-medium text-friday-muted">Quick Actions</p>
      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onAction(action.message)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-friday-border bg-friday-panel px-3 py-1.5 text-xs text-friday-text transition hover:border-friday-accent/40 hover:bg-friday-elevated disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
