"use client";

import { useState } from "react";

import { formatDateTime } from "@/lib/format";
import type { ScheduleItem } from "@/lib/types";

type ScheduleListProps = {
  items: ScheduleItem[];
  onChanged?: () => void;
};

export function ScheduleList({ items, onChanged }: ScheduleListProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        目前沒有提醒或排程
      </p>
    );
  }

  async function handleCancel(jobId: number) {
    setBusyId(jobId);
    setError(null);
    try {
      const response = await fetch(`/api/schedules/${jobId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "取消失敗");
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
        {items.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border border-friday-border-subtle bg-friday-surface/60 px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-relaxed text-friday-text">
                {job.message}
              </p>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded-md bg-friday-elevated px-1.5 py-0.5 text-[10px] text-friday-muted">
                  #{job.id}
                </span>
                <button
                  type="button"
                  disabled={busyId === job.id}
                  onClick={() => void handleCancel(job.id)}
                  className="rounded-lg border border-friday-border px-2 py-0.5 text-[10px] text-friday-muted transition hover:border-friday-danger/40 hover:text-friday-danger disabled:opacity-50"
                >
                  {busyId === job.id ? "…" : "刪除"}
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-friday-muted">{job.recurrence_label}</p>
            <p className="mt-0.5 text-xs text-friday-accent">
              下次 {formatDateTime(job.run_at)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
