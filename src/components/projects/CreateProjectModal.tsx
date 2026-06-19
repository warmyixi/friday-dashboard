"use client";

import { useEffect, useState } from "react";

import type { ProjectSnapshot, ProjectTemplate } from "@/lib/types";

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (project: ProjectSnapshot) => void;
};

export function CreateProjectModal({
  open,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [templateId, setTemplateId] = useState("water_station");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stations, setStations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = templates.find((item) => item.id === templateId);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/projects/templates")
      .then((res) => res.json())
      .then((data: { templates?: ProjectTemplate[] }) => {
        const items = data.templates ?? [];
        setTemplates(items);
        if (items.length > 0 && !items.some((item) => item.id === templateId)) {
          setTemplateId(items[0].id);
        }
      })
      .catch(() => setError("無法載入專案模板"));
  }, [open, templateId]);

  if (!open) return null;

  async function handleSubmit() {
    if (!name.trim()) {
      setError("請填寫專案名稱");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: templateId,
          name: name.trim(),
          description: description.trim() || undefined,
          stations: stations.trim() || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || payload.error || "建立失敗");
      }
      onCreated(payload.project as ProjectSnapshot);
      setName("");
      setDescription("");
      setStations("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
      <div className="safe-bottom max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">新增專案</h3>
            <p className="mt-1 text-sm text-friday-muted">
              選擇模板建立，不必複製既有專案。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-friday-border px-3 py-1 text-sm"
          >
            關閉
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-xs text-friday-muted">
            專案模板
            <select
              value={templateId}
              onChange={(event) => setTemplateId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
          </label>

          {selected ? (
            <div className="rounded-2xl bg-friday-accent-soft/60 p-3 text-sm text-friday-text">
              <p>{selected.description}</p>
              {selected.maintenance_plans.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-friday-muted">
                  {selected.maintenance_plans.map((plan) => (
                    <li key={plan.key}>
                      {plan.label}
                      {plan.filters ? `（${plan.filters} 支濾芯` : ""}
                      {plan.interval_days ? `／${plan.interval_days} 天）` : plan.filters ? "）" : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <label className="block text-xs text-friday-muted">
            專案名稱
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例如：中部加水站濾芯保養"
              className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-xs text-friday-muted">
            說明（選填）
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-xs text-friday-muted">
            {selected?.asset_label ?? "站點"}清單（每行一個，選填）
            <textarea
              value={stations}
              onChange={(event) => setStations(event.target.value)}
              rows={4}
              placeholder={"彰化站\n和美站\n鹿港站"}
              className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
            />
          </label>

          {error ? (
            <p className="text-sm text-friday-danger">{error}</p>
          ) : null}

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleSubmit()}
            className="w-full rounded-xl bg-friday-accent py-3 text-sm font-medium text-white hover:bg-friday-accent-hover disabled:opacity-50"
          >
            {loading ? "建立中…" : "建立專案"}
          </button>
        </div>
      </div>
    </div>
  );
}
