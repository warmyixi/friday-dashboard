export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  message: string;
};

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: "lamp-on", label: "開燈", icon: "💡", message: "開啟主臥站立燈" },
  { id: "lamp-off", label: "關燈", icon: "💡", message: "關閉主臥站立燈" },
  { id: "fan-on", label: "開風扇", icon: "🌀", message: "開啟主臥風扇" },
  { id: "progress", label: "專案進度", icon: "📊", message: "仁大專案目前進度多少？" },
  { id: "remaining", label: "剩餘站點", icon: "📍", message: "剩下哪些站還沒完成？" },
  { id: "complete-yd", label: "完成測站", icon: "✅", message: "今天完成 YD-29" },
  { id: "arrival", label: "到家", icon: "🏠", message: "到家模式" },
  { id: "away", label: "離家", icon: "🚗", message: "我要出門" },
];

const STORAGE_KEY = "friday-quick-actions-v1";

function isQuickAction(value: unknown): value is QuickAction {
  if (!value || typeof value !== "object") return false;
  const item = value as QuickAction;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.icon === "string" &&
    typeof item.message === "string"
  );
}

export function loadQuickActions(): QuickAction[] {
  if (typeof window === "undefined") return DEFAULT_QUICK_ACTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_QUICK_ACTIONS;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_QUICK_ACTIONS;
    }
    const cleaned = parsed.filter(isQuickAction);
    return cleaned.length > 0 ? cleaned : DEFAULT_QUICK_ACTIONS;
  } catch {
    return DEFAULT_QUICK_ACTIONS;
  }
}

export function saveQuickActions(actions: QuickAction[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
}

export function createQuickAction(
  partial: Pick<QuickAction, "label" | "message"> & Partial<Pick<QuickAction, "icon">>,
): QuickAction {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    icon: partial.icon ?? "⚡",
    label: partial.label.trim(),
    message: partial.message.trim(),
  };
}
