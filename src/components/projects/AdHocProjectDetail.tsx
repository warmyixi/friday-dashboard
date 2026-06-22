"use client";

import { Badge } from "@/components/ui/Badge";
import { SectionCard } from "@/components/SectionCard";
import type { ProjectSnapshot, ProjectWorkLog } from "@/lib/types";

const ADHOC_STATUS_LABELS: Record<string, string> = {
  open: "剛建立",
  in_progress: "進行中",
  blocked: "卡關",
  done: "已完成",
};

const ADHOC_SUBTYPE_LABELS: Record<string, string> = {
  incident: "問題追蹤",
  research: "研究主題",
  event: "一次性事件",
};

function adhocEntries(logs: ProjectWorkLog[]): ProjectWorkLog[] {
  return logs
    .filter((log) =>
      ["adhoc_create", "adhoc_entry", "adhoc_close"].includes(log.action),
    )
    .sort((a, b) => String(b.worked_at).localeCompare(String(a.worked_at)));
}

type AdHocProjectDetailProps = {
  project: ProjectSnapshot;
};

export function AdHocProjectDetail({ project }: AdHocProjectDetailProps) {
  const entries = adhocEntries(project.work_logs ?? []);
  const statusLabel =
    ADHOC_STATUS_LABELS[project.adhoc_status ?? "in_progress"] ?? "進行中";
  const subtypeLabel =
    ADHOC_SUBTYPE_LABELS[project.adhoc_subtype ?? "event"] ?? "事件";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">{subtypeLabel}</Badge>
          <Badge variant={project.adhoc_status === "blocked" ? "warn" : "success"}>
            {statusLabel}
          </Badge>
        </div>
        {project.summary ? (
          <p className="mt-3 text-sm text-friday-text">{project.summary}</p>
        ) : null}
        <p className="mt-3 text-xs text-friday-muted">
          透過 Discord 或 Dashboard 對話新增紀錄、更新狀態或結案；此頁僅顯示現況。
        </p>
      </div>

      <SectionCard title="紀錄時間軸" icon="📝" count={entries.length}>
        {entries.length === 0 ? (
          <p className="text-sm text-friday-muted">尚無紀錄。</p>
        ) : (
          <div className="space-y-2">
            {entries.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-friday-border-subtle bg-friday-elevated/60 px-3 py-2 text-sm"
              >
                <p className="font-medium text-friday-text">
                  {String(log.worked_at || "").slice(0, 16).replace("T", " ")}
                </p>
                <p className="mt-1 text-friday-muted">{log.note}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export function AdHocProjectCard({
  project,
  onSelect,
}: {
  project: ProjectSnapshot;
  onSelect: () => void;
}) {
  const statusLabel =
    ADHOC_STATUS_LABELS[project.adhoc_status ?? "in_progress"] ?? "進行中";
  const entryCount = (project.work_logs ?? []).filter((log) =>
    ["adhoc_create", "adhoc_entry"].includes(log.action),
  ).length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/50 px-4 py-4 text-left shadow-card transition hover:border-violet-200 hover:bg-violet-50"
    >
      <div>
        <p className="font-semibold text-friday-text">{project.name}</p>
        <p className="mt-0.5 text-xs text-friday-muted">
          {statusLabel} · {entryCount} 筆紀錄
        </p>
        {project.summary ? (
          <p className="mt-1 line-clamp-2 text-xs text-friday-muted">{project.summary}</p>
        ) : null}
      </div>
      <span className="text-friday-accent">→</span>
    </button>
  );
}
