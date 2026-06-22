"use client";

import { useState } from "react";

import { formatDateTime } from "@/lib/format";
import type { TaskItem } from "@/lib/types";

type TaskListProps = {
  items: TaskItem[];
  onChanged?: () => void;
};

const TYPE_BADGE: Record<string, string> = {
  personal: "bg-sky-100 text-sky-800",
  work: "bg-emerald-100 text-emerald-800",
  incident: "bg-amber-100 text-amber-900",
  reminder: "bg-violet-100 text-violet-800",
  follow_up: "bg-slate-100 text-slate-700",
};

export function TaskList({ items, onChanged }: TaskListProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        目前沒有進行中任務
      </p>
    );
  }

  async function handleCancel(taskId: number) {
    setBusyId(taskId);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || payload.message || `HTTP ${response.status}`);
      }
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p className="rounded-lg bg-friday-danger/10 px-3 py-2 text-xs text-friday-danger">
          {error}
        </p>
      ) : null}
      <ul className="space-y-2">
        {items.map((task) => {
          const when = task.due_at || task.remind_at;
          const badge =
            TYPE_BADGE[task.task_type] ?? "bg-friday-elevated text-friday-muted";
          return (
            <li
              key={task.id}
              className="rounded-xl border border-friday-border-subtle bg-friday-surface/60 px-3 py-2.5 transition hover:border-friday-border hover:bg-friday-elevated/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-friday-text">
                    {task.title}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className={`rounded-md px-1.5 py-0.5 ${badge}`}>
                      {task.task_type_label}
                    </span>
                    <span className="text-friday-muted">{task.status_label}</span>
                    {task.project_name ? (
                      <span className="text-friday-muted">· {task.project_name}</span>
                    ) : null}
                    {task.asset_code ? (
                      <span className="text-friday-muted">· {task.asset_code}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="rounded-md bg-friday-elevated px-1.5 py-0.5 text-[10px] text-friday-muted">
                    #{task.id}
                  </span>
                  <button
                    type="button"
                    disabled={busyId === task.id}
                    onClick={() => void handleCancel(task.id)}
                    className="rounded-lg border border-friday-border px-2 py-0.5 text-[10px] text-friday-muted transition hover:border-friday-danger/40 hover:text-friday-danger disabled:opacity-50"
                  >
                    {busyId === task.id ? "…" : "刪除"}
                  </button>
                </div>
              </div>
              {when ? (
                <p className="mt-1.5 text-xs text-friday-muted">
                  {formatDateTime(when)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
