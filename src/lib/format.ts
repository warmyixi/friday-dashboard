export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return value.replace("T", " ").slice(0, 16);
}

export function formatRelativeUpdate(value: string | null): string {
  if (!value) return "尚未更新";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("zh-TW", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function onOffLabel(state: string | undefined): string {
  const normalized = (state || "unknown").toLowerCase();
  if (normalized === "on") return "ON";
  if (normalized === "off") return "OFF";
  return normalized.toUpperCase();
}

export function hvacModeLabel(mode: string | undefined): string {
  const normalized = (mode || "unknown").toLowerCase();
  const map: Record<string, string> = {
    cool: "Cool",
    heat: "Heat",
    off: "Off",
    unknown: "Unknown",
  };
  return map[normalized] ?? mode ?? "Unknown";
}

export function deviceStateLabel(state: string): string {
  const map: Record<string, string> = {
    on: "開啟",
    off: "關閉",
    unknown: "未知",
  };
  return map[state] ?? state;
}

export function fanModeLabel(mode: string): string {
  const map: Record<string, string> = {
    low: "低",
    mid: "中",
    high: "高",
    highest: "最高",
    unknown: "未知",
  };
  return map[mode] ?? mode;
}
