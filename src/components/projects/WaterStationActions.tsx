"use client";

import { useState } from "react";

import type { ProjectAsset, ProjectSnapshot } from "@/lib/types";

type WaterStationActionsProps = {
  project: ProjectSnapshot;
  asset: ProjectAsset;
  onDone: () => void;
};

type ModalKind = "minor" | "major" | "repair" | null;

function nextServiceText(schedule: ProjectAsset["maintenance_schedule"]): string {
  if (!schedule?.next_service_at) return "—";
  const type = schedule.next_service_type;
  const label =
    type === "major_6m" ? "大保" : type === "minor_3m" ? "小保" : "保養";
  return `${label} ${schedule.next_service_at}`;
}

function stripTon(value: string): string {
  return value.replace(/噸$/, "").trim();
}

export function WaterStationActions({
  asset,
  onDone,
}: WaterStationActionsProps) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [laborWage, setLaborWage] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [waterVolume, setWaterVolume] = useState("");
  const [workItem, setWorkItem] = useState("");
  const [partsCost, setPartsCost] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const schedule = asset.maintenance_schedule;
  const savedWaterVolume =
    asset.checklist.find((item) => item.item_key === "water_volume")?.value_text ?? "";

  async function submitMaintenance(type: "minor_3m" | "major_6m") {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/projects/water-station/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: asset.id,
          maintenance_type: type,
          labor_wage: laborWage ? Number(laborWage) : undefined,
          duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
          water_volume: waterVolume || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || payload.error || "儲存失敗");
      }
      const nextLabel = payload.next_maintenance_label as string | undefined;
      const next = payload.next_maintenance_at as string | undefined;
      setMessage(
        next
          ? `已記錄，下次${nextLabel || "保養"} ${next}${payload.calendar_scheduled ? "（已排進行事曆）" : ""}`
          : "已記錄",
      );
      setModal(null);
      onDone();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  async function submitRepair() {
    if (!workItem.trim()) {
      setMessage("請填寫維修工項");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/projects/water-station/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: asset.id,
          work_item: workItem.trim(),
          labor_wage: Number(laborWage || 0),
          parts_cost: Number(partsCost || 0),
          water_volume: waterVolume || undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || payload.error || "儲存失敗");
      }
      setMessage("維修已記錄");
      setModal(null);
      onDone();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  function openModal(kind: ModalKind) {
    setLaborWage("");
    setDurationMinutes("");
    setWaterVolume(stripTon(savedWaterVolume));
    setWorkItem("");
    setPartsCost("");
    setMessage(null);
    setModal(kind);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-3">
      {schedule ? (
        <p className="text-xs text-friday-muted">
          下次保養：<span className="font-medium text-friday-text">{nextServiceText(schedule)}</span>
          {schedule.last_service_at ? (
            <span className="ml-2">
              （上次 {schedule.last_service_at.slice(0, 10)}）
            </span>
          ) : null}
        </p>
      ) : null}

      {savedWaterVolume ? (
        <p className="text-xs text-friday-info">最近水量：{savedWaterVolume}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openModal("minor")}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-700 shadow-sm ring-1 ring-sky-200"
        >
          三月小保（3 支）
        </button>
        <button
          type="button"
          onClick={() => openModal("major")}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-700 shadow-sm ring-1 ring-sky-200"
        >
          大保（7 支）
        </button>
        <button
          type="button"
          onClick={() => openModal("repair")}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-amber-700 shadow-sm ring-1 ring-amber-200"
        >
          維修
        </button>
      </div>

      {message ? <p className="text-xs text-friday-muted">{message}</p> : null}

      {modal ? (
        <div className="rounded-2xl border border-friday-border bg-white p-3">
          <p className="text-sm font-medium">
            {modal === "minor"
              ? "三月小保養"
              : modal === "major"
                ? "大保養"
                : "維修紀錄"}
            ｜{asset.code}
          </p>

          {modal === "repair" ? (
            <label className="mt-3 block text-xs text-friday-muted">
              工項
              <input
                value={workItem}
                onChange={(e) => setWorkItem(e.target.value)}
                className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
                placeholder="例如：更換幫浦"
              />
            </label>
          ) : null}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-friday-muted">
              工資（元）
              <input
                value={laborWage}
                onChange={(e) => setLaborWage(e.target.value)}
                type="number"
                className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
                placeholder={modal === "major" ? "1500" : "800"}
              />
            </label>
            {modal === "repair" ? (
              <label className="text-xs text-friday-muted">
                材料費（元）
                <input
                  value={partsCost}
                  onChange={(e) => setPartsCost(e.target.value)}
                  type="number"
                  className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
                />
              </label>
            ) : (
              <label className="text-xs text-friday-muted">
                工時（分鐘）
                <input
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  type="number"
                  className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
                  placeholder={modal === "major" ? "60" : "30"}
                />
              </label>
            )}
          </div>

          <label className="mt-3 block text-xs text-friday-muted">
            水量（噸，選填）
            <div className="mt-1 flex items-center gap-2">
              <input
                value={waterVolume}
                onChange={(e) => setWaterVolume(e.target.value)}
                type="number"
                step="any"
                className="w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
                placeholder="例如 12.5"
              />
              <span className="shrink-0 text-sm text-friday-muted">噸</span>
            </div>
          </label>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void (modal === "repair"
                  ? submitRepair()
                  : submitMaintenance(modal === "major" ? "major_6m" : "minor_3m"))
              }
              className="rounded-xl bg-friday-accent px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "儲存中…" : "完成並排下次"}
            </button>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="rounded-xl border border-friday-border px-4 py-2 text-sm"
            >
              取消
            </button>
          </div>
          <p className="mt-2 text-[11px] text-friday-muted">
            完成後依週期（大保→三個月→小保→三個月→大保）計算下次保養，並嘗試加入 Google 行事曆。
          </p>
        </div>
      ) : null}
    </div>
  );
}
