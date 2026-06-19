"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import type { ProjectAsset, ProjectSnapshot } from "@/lib/types";

const ASSET_TYPE_OPTIONS = [
  { value: "station", label: "測站" },
  { value: "rectifier", label: "整流站" },
] as const;

function assetTypeLabel(type: string): string {
  if (type === "rectifier") return "整流站";
  if (type === "station") return "測站";
  return type;
}

type FieldAssetManagerProps = {
  project: ProjectSnapshot;
  onChanged: () => void;
};

export function FieldAssetManager({ project, onChanged }: FieldAssetManagerProps) {
  const [code, setCode] = useState("");
  const [assetType, setAssetType] = useState<"station" | "rectifier">("station");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editType, setEditType] = useState<"station" | "rectifier">("station");

  async function handleAdd() {
    if (!code.trim()) {
      setMessage("請輸入站點代碼");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/${project.id}/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), asset_type: assetType }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || payload.message || "新增失敗");
      }
      setCode("");
      setMessage(`已新增 ${assetTypeLabel(assetType)} ${code.trim()}`);
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "新增失敗");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(asset: ProjectAsset) {
    if (!window.confirm(`確定刪除 ${asset.code}？`)) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/assets/${asset.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "刪除失敗");
      }
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "刪除失敗");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(assetId: number) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editCode.trim() || undefined,
          asset_type: editType,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "更新失敗");
      }
      setEditingId(null);
      onChanged();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-friday-border-subtle bg-white/85 p-4 shadow-card">
      <p className="text-sm font-medium">站點管理</p>
      <p className="mt-1 text-xs text-friday-muted">
        每季保養（1、4、7、10 月）。可手動新增／修改／刪除測站或整流站，也可用 Discord 讓 Friday 執行。
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="text-xs text-friday-muted">
          代碼
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="YD-50"
            className="mt-1 block w-32 rounded-xl border border-friday-border px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-friday-muted">
          類型
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as "station" | "rectifier")}
            className="mt-1 block rounded-xl border border-friday-border px-3 py-2 text-sm"
          >
            {ASSET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleAdd()}
          className="rounded-xl bg-friday-accent px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          新增
        </button>
      </div>

      {message ? <p className="mt-2 text-xs text-friday-muted">{message}</p> : null}

      <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
        {project.assets.map((asset) => (
          <div
            key={asset.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-friday-border-subtle bg-friday-elevated/50 px-3 py-2 text-sm"
          >
            {editingId === asset.id ? (
              <>
                <input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="w-28 rounded-lg border border-friday-border px-2 py-1 text-sm"
                />
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as "station" | "rectifier")}
                  className="rounded-lg border border-friday-border px-2 py-1 text-sm"
                >
                  {ASSET_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => void handleSaveEdit(asset.id)}
                    className="text-xs text-friday-accent"
                  >
                    儲存
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-xs text-friday-muted"
                  >
                    取消
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{asset.code}</span>
                  <Badge variant="muted">{assetTypeLabel(asset.asset_type)}</Badge>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(asset.id);
                      setEditCode(asset.code);
                      setEditType(
                        asset.asset_type === "rectifier" ? "rectifier" : "station",
                      );
                    }}
                    className="text-friday-accent"
                  >
                    修改
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(asset)}
                    className="text-rose-600"
                  >
                    刪除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
