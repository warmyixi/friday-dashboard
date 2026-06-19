export type MainTab = "chat" | "home" | "projects" | "settings";

export type ProjectSubTab = "overview" | "assets" | "issues";

export const MAIN_TABS: Array<{
  id: MainTab;
  label: string;
  icon: string;
  description: string;
}> = [
  { id: "chat", label: "對話", icon: "💬", description: "Friday 指令與回報" },
  { id: "home", label: "生活", icon: "🏠", description: "待辦、排程、智慧家庭" },
  { id: "projects", label: "專案", icon: "📁", description: "現場專案與測站" },
  { id: "settings", label: "設定", icon: "⚙️", description: "快捷指令與偏好" },
];

export const PROJECT_SUB_TABS: Array<{
  id: ProjectSubTab;
  label: string;
}> = [
  { id: "overview", label: "概覽" },
  { id: "assets", label: "測站" },
  { id: "issues", label: "問題" },
];

export const ASSET_STATUS_LABELS: Record<string, string> = {
  completed: "已完成",
  pending: "待完成",
  in_progress: "進行中",
  blocked: "無法施工",
  skipped: "併站略過",
};

export const ASSET_STATUS_OPTIONS = [
  "completed",
  "pending",
  "in_progress",
  "blocked",
  "skipped",
] as const;

export const BLOCK_REASON_OPTIONS = [
  { value: "buried_lost", label: "埋失" },
  { value: "not_found", label: "找不到測站" },
  { value: "coordinate_error", label: "座標異常" },
  { value: "hydrogen_station", label: "加氫站" },
  { value: "factory_restricted", label: "高廠內" },
  { value: "merged", label: "併站" },
  { value: "other", label: "其他" },
];
