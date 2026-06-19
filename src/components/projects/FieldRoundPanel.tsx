"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import type { MaintenanceRound, ProjectSnapshot } from "@/lib/types";

type FieldRoundPanelProps = {
  project: ProjectSnapshot;
  onChanged: () => void;
};

const QUARTER_OPTIONS = ["Q1", "Q2", "Q3", "Q4"] as const;

function defaultYear(): number {
  return new Date().getFullYear();
}

export function FieldRoundPanel({ project, onChanged }: FieldRoundPanelProps) {
  const [year, setYear] = useState(defaultYear());
  const [quarter, setQuarter] = useState<(typeof QUARTER_OPTIONS)[number]>("Q2");
  const [copyPrevious, setCopyPrevious] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const rounds = project.rounds ?? [];
  const viewing = project.viewing_round ?? project.active_round;
  const suggestedKey = useMemo(() => {
    if (rounds.length === 0) return `${defaultYear()}-Q1`;
    const latest = rounds[0]?.round_key ?? "";
    const [y, q] = latest.split("-");
    const order = ["Q1", "Q2", "Q3", "Q4"];
    const idx = order.indexOf(q);
    if (idx >= 0 && idx < 3) return `${y}-${order[idx + 1]}`;
    return `${Number(y) + 1}-Q1`;
  }, [rounds]);

  async function selectRound(round: MaintenanceRound) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/projects/${project.id}/rounds/${round.id}/view`,
        { method: "POST" },
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "切換失敗");
      }
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "切換失敗");
    } finally {
      setSaving(false);
    }
  }

  async function createRound() {
    const roundKey = `${year}-${quarter}`;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/${project.id}/rounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round_key: roundKey,
          copy_from_previous: copyPrevious,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || payload.message || "建立失敗");
      }
      setMessage(`已建立 ${payload.label || roundKey}`);
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "建立失敗");
    } finally {
      setSaving(false);
    }
  }

  async function completeRound(roundId: number) {
    if (!window.confirm("確定標記本季施作為已完成？")) return;
    setSaving(true);
    try {
      const response = await fetch(
        `/api/projects/${project.id}/rounds/${roundId}/complete`,
        { method: "POST" },
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "更新失敗");
      }
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-friday-border-subtle bg-white/85 p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">季別施作</p>
          <p className="mt-1 text-xs text-friday-muted">
            一月=去年Q4 · 四月=Q1 · 七月=Q2 · 十月=Q3。可從上季複製站點狀態再手動調整。
          </p>
        </div>
        {viewing ? (
          <Badge variant={viewing.status === "completed" ? "success" : "info"}>
            目前：{viewing.label}
          </Badge>
        ) : null}
      </div>

      {rounds.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {rounds.map((round) => (
            <button
              key={round.id}
              type="button"
              disabled={saving}
              onClick={() => void selectRound(round)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                viewing?.id === round.id
                  ? "bg-friday-accent text-white"
                  : "bg-friday-elevated text-friday-muted hover:bg-friday-accent-soft"
              }`}
            >
              {round.label}
              {round.status === "completed" ? " ✓" : ""}
            </button>
          ))}
          {viewing?.status === "in_progress" ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void completeRound(viewing.id)}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
            >
              標記本季完成
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-dashed border-friday-border bg-friday-elevated/40 p-3">
        <p className="text-xs font-medium text-friday-text">新增施作</p>
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <label className="text-xs text-friday-muted">
            年度
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 block w-24 rounded-lg border border-friday-border px-2 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs text-friday-muted">
            季度
            <select
              value={quarter}
              onChange={(e) =>
                setQuarter(e.target.value as (typeof QUARTER_OPTIONS)[number])
              }
              className="mt-1 block rounded-lg border border-friday-border px-2 py-1.5 text-sm"
            >
              {QUARTER_OPTIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-friday-muted">
            <input
              type="checkbox"
              checked={copyPrevious}
              onChange={(e) => setCopyPrevious(e.target.checked)}
            />
            帶入上季站點資料
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() => void createRound()}
            className="rounded-xl bg-friday-accent px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            建立 {year}-{quarter}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              const [y, q] = suggestedKey.split("-");
              setYear(Number(y));
              setQuarter(q as (typeof QUARTER_OPTIONS)[number]);
            }}
            className="text-xs text-friday-accent hover:underline"
          >
            建議：{suggestedKey}
          </button>
        </div>
      </div>

      {message ? <p className="mt-2 text-xs text-friday-muted">{message}</p> : null}
    </div>
  );
}
