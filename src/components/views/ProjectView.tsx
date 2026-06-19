"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FieldAssetManager } from "@/components/projects/FieldAssetManager";
import { FieldRoundPanel } from "@/components/projects/FieldRoundPanel";
import { WaterStationActions } from "@/components/projects/WaterStationActions";
import { SectionCard } from "@/components/SectionCard";
import { Badge } from "@/components/ui/Badge";
import {
  ASSET_STATUS_LABELS,
  ASSET_STATUS_OPTIONS,
  BLOCK_REASON_OPTIONS,
  PROJECT_SUB_TABS,
  type ProjectSubTab,
} from "@/lib/navigation";
import type { ProjectAsset, ProjectSnapshot, ProjectWorkLog } from "@/lib/types";

type ProjectViewProps = {
  projects: ProjectSnapshot[];
  loading: boolean;
  onAssetUpdated: () => void;
  onProjectsChanged?: () => void;
};

const WATER_STATION_DOT: Record<string, string> = {
  皇家貴賓: "bg-amber-500",
  金鹽埕: "bg-sky-500",
};

function isFixedFieldProject(project: ProjectSnapshot): boolean {
  return (
    project.fixed === true &&
    (project.project_type === "field_inspection" ||
      project.project_type === "cathodic_protection")
  );
}

function diffDays(earlier: string, later: string): number {
  const a = new Date(earlier.slice(0, 10));
  const b = new Date(later.slice(0, 10));
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function enrichMaintenanceLogs(logs: ProjectWorkLog[]): Array<
  ProjectWorkLog & { days_since_last: number | null }
> {
  const sorted = [...logs]
    .filter(
      (log) =>
        log.action === "maintenance" ||
        log.action === "import_seed" ||
        log.action === "repair",
    )
    .sort((a, b) => String(a.worked_at).localeCompare(String(b.worked_at)));

  const lastByAsset: Record<string, string> = {};
  const enriched = sorted.map((log) => {
    const code = log.asset_code || "";
    const day = String(log.worked_at || "").slice(0, 10);
    let daysSince =
      typeof log.metadata?.days_since_last === "number"
        ? (log.metadata.days_since_last as number)
        : null;
    if (daysSince == null && lastByAsset[code]) {
      daysSince = diffDays(lastByAsset[code], day);
    }
    if (day) lastByAsset[code] = day;
    return { ...log, days_since_last: daysSince };
  });
  return enriched.reverse();
}

function MaintenanceLogRow({
  log,
  dotClass,
}: {
  log: ProjectWorkLog & { days_since_last: number | null };
  dotClass?: string;
}) {
  return (
    <div className="rounded-xl border border-friday-border-subtle bg-friday-elevated/60 px-3 py-2 text-sm">
      <p className="flex items-center gap-2 font-medium">
        {dotClass ? <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} /> : null}
        {String(log.worked_at || "").slice(0, 10)}
        {log.asset_code ? `｜${log.asset_code}` : ""}
      </p>
      <p className="text-friday-muted">{log.note}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-friday-accent">
        {typeof log.metadata?.labor_wage === "number" ? (
          <span>工資 {log.metadata.labor_wage} 元</span>
        ) : null}
        {log.days_since_last != null ? (
          <span>距上次 {log.days_since_last} 天</span>
        ) : (
          <span className="text-friday-muted">首次紀錄</span>
        )}
        {typeof log.metadata?.next_maintenance_at === "string" ? (
          <span>
            下次
            {typeof log.metadata.next_maintenance_label === "string"
              ? log.metadata.next_maintenance_label
              : "保養"}{" "}
            {log.metadata.next_maintenance_at}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function WaterStationLogHistory({ project }: { project: ProjectSnapshot }) {
  const logs = enrichMaintenanceLogs(project.work_logs ?? []);
  const stations = ["皇家貴賓", "金鹽埕"];

  if (logs.length === 0) return null;

  return (
    <SectionCard title="保養紀錄" icon="📓" count={logs.length}>
      <div className="grid gap-4 sm:grid-cols-2">
        {stations.map((station) => {
          const stationLogs = logs.filter((log) => log.asset_code === station);
          if (stationLogs.length === 0) return null;
          return (
            <div key={station} className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium text-friday-text">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${WATER_STATION_DOT[station] ?? "bg-slate-400"}`}
                />
                {station}
              </h4>
              {stationLogs.map((log) => (
                <MaintenanceLogRow
                  key={log.id}
                  log={log}
                  dotClass={WATER_STATION_DOT[station]}
                />
              ))}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function statusVariant(status: string): "success" | "warn" | "muted" | "info" {
  if (status === "completed") return "success";
  if (status === "blocked") return "warn";
  if (status === "in_progress") return "info";
  return "muted";
}

function ProgressCard({
  title,
  metric,
}: {
  title: string;
  metric: ProjectSnapshot["progress"]["overall"];
}) {
  return (
    <div className="rounded-2xl border border-friday-border-subtle bg-white/80 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-friday-text">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-friday-accent">
            {metric.display}
          </p>
        </div>
        {metric.progress_pct > 0 && metric.display.includes("%") ? (
          <span className="rounded-full bg-friday-accent-soft px-3 py-1 text-xs font-semibold text-friday-accent">
            {metric.progress_pct}%
          </span>
        ) : null}
      </div>
      {metric.display.includes("%") ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-friday-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-friday-accent to-emerald-400 transition-all"
            style={{ width: `${metric.progress_pct}%` }}
          />
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-relaxed text-friday-muted">
        {metric.note}
      </p>
    </div>
  );
}

function WaterStationCycleNote() {
  return (
    <p className="text-sm text-friday-muted">
      兩站週期相同：大保 → 三個月 → 小保 → 三個月 → 大保。每次可記錄工資、工時、水量（噸）。
    </p>
  );
}

function WaterStationCard({
  asset,
  project,
  onAssetUpdated,
}: {
  asset: ProjectAsset;
  project: ProjectSnapshot;
  onAssetUpdated: () => void;
}) {
  const waterVolume =
    asset.checklist.find((item) => item.item_key === "water_volume")?.value_text ?? "";

  return (
    <div
      id={`water-station-${asset.id}`}
      className="rounded-2xl border border-friday-border-subtle bg-white/85 p-4 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{asset.code}</span>
            <Badge variant="success">營運中</Badge>
          </div>
          {asset.notes ? (
            <p className="mt-1 text-sm text-friday-muted">{asset.notes}</p>
          ) : null}
          {waterVolume ? (
            <p className="mt-1 text-xs text-friday-info">最近水量：{waterVolume}</p>
          ) : null}
        </div>
      </div>
      <WaterStationActions project={project} asset={asset} onDone={onAssetUpdated} />
    </div>
  );
}

function AssetEditor({
  asset,
  project,
  onSaved,
}: {
  asset: ProjectAsset;
  project: ProjectSnapshot;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(asset.status);
  const [blockReason, setBlockReason] = useState(asset.block_reason ?? "");
  const [notes, setNotes] = useState(asset.notes ?? "");
  const [mapsUrl, setMapsUrl] = useState(asset.maps_url ?? "");
  const [waterVolume, setWaterVolume] = useState(
    asset.checklist.find((item) => item.item_key === "water_volume")?.value_text ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isWaterStation = project.project_type === "water_station";
  const isFieldFixed = isFixedFieldProject(project);
  const roundReadOnly =
    isFieldFixed &&
    project.viewing_round?.status === "completed" &&
    project.active_round?.id !== project.viewing_round?.id;

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: isWaterStation ? "completed" : status,
          block_reason: status === "blocked" ? blockReason || "other" : null,
          notes: notes || null,
          maps_url: isFieldFixed ? mapsUrl || null : undefined,
          water_volume: isWaterStation ? waterVolume || null : undefined,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "更新失敗");
      }
      setMessage("已儲存");
      onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-friday-border-subtle bg-friday-elevated/70 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {!isWaterStation ? (
          <label className="text-xs text-friday-muted">
            狀態
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-1 w-full rounded-xl border border-friday-border bg-white px-3 py-2 text-sm"
            >
              {ASSET_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {ASSET_STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {status === "blocked" ? (
          <label className="text-xs text-friday-muted">
            原因
            <select
              value={blockReason}
              onChange={(event) => setBlockReason(event.target.value)}
              className="mt-1 w-full rounded-xl border border-friday-border bg-white px-3 py-2 text-sm"
            >
              <option value="">選擇原因</option>
              {BLOCK_REASON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {isWaterStation ? (
          <label className="text-xs text-friday-muted sm:col-span-2">
            水量（選填，之後回報也可記）
            <input
              value={waterVolume}
              onChange={(event) => setWaterVolume(event.target.value)}
              placeholder="例如：12500"
              className="mt-1 w-full rounded-xl border border-friday-border bg-white px-3 py-2 text-sm"
            />
          </label>
        ) : null}
      </div>

      {isFieldFixed ? (
        <label className="mt-3 block text-xs text-friday-muted">
          Google 地圖連結（測站／整流站位置）
          <input
            value={mapsUrl}
            onChange={(event) => setMapsUrl(event.target.value)}
            placeholder="https://maps.google.com/..."
            disabled={roundReadOnly}
            className="mt-1 w-full rounded-xl border border-friday-border bg-white px-3 py-2 text-sm disabled:opacity-60"
          />
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-friday-accent hover:underline"
            >
              在地圖中開啟
            </a>
          ) : null}
        </label>
      ) : null}

      <label className="mt-3 block text-xs text-friday-muted">
        備註
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-friday-border bg-white px-3 py-2 text-sm"
        />
      </label>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || roundReadOnly}
          className="rounded-xl bg-friday-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-friday-accent-hover disabled:opacity-50"
        >
          {saving ? "儲存中…" : "儲存"}
        </button>
        {message ? <span className="text-xs text-friday-muted">{message}</span> : null}
      </div>
    </div>
  );
}

function ProjectDetail({
  project,
  onBack,
  onAssetUpdated,
  focusAssetId,
}: {
  project: ProjectSnapshot;
  onBack: () => void;
  onAssetUpdated: () => void;
  focusAssetId?: number | null;
}) {
  const isWaterStation = project.project_type === "water_station";
  const isFieldFixed = isFixedFieldProject(project);
  const [subTab, setSubTab] = useState<ProjectSubTab>("overview");
  const [expandedAssetId, setExpandedAssetId] = useState<number | null>(null);
  const [assetFilter, setAssetFilter] = useState<string>("all");
  const scrolledRef = useRef(false);

  const subTabs = isWaterStation
    ? PROJECT_SUB_TABS.filter((tab) => tab.id !== "assets")
    : PROJECT_SUB_TABS;

  const filteredAssets = useMemo(() => {
    if (assetFilter === "all") return project.assets;
    return project.assets.filter((asset) => asset.status === assetFilter);
  }, [assetFilter, project.assets]);

  const assetFilters = isWaterStation
    ? [{ id: "all", label: "全部" }, { id: "completed", label: "營運中" }]
    : [
        { id: "all", label: "全部" },
        { id: "completed", label: "已完成" },
        { id: "pending", label: "待完成" },
        { id: "blocked", label: "無法施工" },
        { id: "skipped", label: "併站" },
      ];

  useEffect(() => {
    if (!focusAssetId || scrolledRef.current) return;
    const el = document.getElementById(`water-station-${focusAssetId}`);
    if (el) {
      scrolledRef.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [focusAssetId, project.assets]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-friday-accent hover:underline"
      >
        ← 返回專案列表
      </button>

      <div
        className={`rounded-3xl p-5 text-white shadow-card ${
          isWaterStation
            ? "bg-gradient-to-br from-sky-700 to-cyan-600"
            : "bg-gradient-to-br from-slate-900 to-slate-700"
        }`}
      >
        <p className="text-sm text-white/70">{project.template_label ?? "專案"}</p>
        <h2 className="mt-1 text-2xl font-semibold">{project.name}</h2>
        <p className="mt-2 text-sm text-white/85">
          {project.description || "專案工作管理"}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              subTab === tab.id
                ? "bg-friday-accent text-white"
                : "bg-white text-friday-muted shadow-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === "overview" ? (
        <div className="space-y-4">
          {!isWaterStation ? (
            <>
              {isFieldFixed ? (
                <FieldRoundPanel project={project} onChanged={onAssetUpdated} />
              ) : null}
              <ProgressCard title={project.progress.overall.label} metric={project.progress.overall} />
              <ProgressCard
                title={project.progress.actionable.label}
                metric={project.progress.actionable}
              />
            </>
          ) : (
            <WaterStationCycleNote />
          )}

          {isWaterStation ? (
            <div className="space-y-3">
              {project.assets.map((asset) => (
                <WaterStationCard
                  key={asset.id}
                  asset={asset}
                  project={project}
                  onAssetUpdated={onAssetUpdated}
                />
              ))}
            </div>
          ) : null}

          {isWaterStation ? (
            <WaterStationLogHistory project={project} />
          ) : null}

          {isFieldFixed && (project.work_logs?.length ?? 0) > 0 ? (
            <SectionCard title="保養紀錄" icon="📓" count={project.work_logs?.length}>
              <div className="space-y-2">
                {enrichMaintenanceLogs(project.work_logs ?? []).map((log) => (
                  <MaintenanceLogRow key={log.id} log={log} />
                ))}
              </div>
            </SectionCard>
          ) : null}

          {!isWaterStation ? (
            <>
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { label: "總站數", value: project.progress.total },
                  { label: "已完成", value: project.progress.completed },
                  {
                    label: "待完成",
                    value: project.progress.pending + project.progress.in_progress,
                  },
                  { label: "無法施工", value: project.progress.blocked },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-friday-border-subtle bg-white/80 p-4 text-center shadow-card"
                  >
                    <p className="text-xs text-friday-muted">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              {project.progress.remaining_codes.length > 0 ? (
                <SectionCard title="待完成測站" icon="⏳">
                  <p className="text-sm">{project.progress.remaining_codes.join("、")}</p>
                </SectionCard>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      {subTab === "assets" && !isWaterStation ? (
        <div className="space-y-3">
          {isFieldFixed ? (
            <FieldAssetManager project={project} onChanged={onAssetUpdated} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {assetFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setAssetFilter(filter.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  assetFilter === filter.id
                    ? "bg-friday-accent text-white"
                    : "bg-white text-friday-muted shadow-card"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-friday-border-subtle bg-white/85 p-4 shadow-card"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedAssetId((current) =>
                    current === asset.id ? null : asset.id,
                  )
                }
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">{asset.code}</span>
                    {!isWaterStation ? (
                      <Badge variant={statusVariant(asset.status)}>
                        {ASSET_STATUS_LABELS[asset.status] ?? asset.status}
                      </Badge>
                    ) : (
                      <Badge variant="success">營運中</Badge>
                    )}
                  </div>
                  {asset.notes ? (
                    <p className="mt-1 text-sm text-friday-muted">{asset.notes}</p>
                  ) : null}
                  {asset.maps_url ? (
                    <a
                      href={asset.maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-friday-accent hover:underline"
                    >
                      📍 地圖位置
                    </a>
                  ) : null}
                  {asset.checklist.find((item) => item.item_key === "water_volume")?.value_text ? (
                    <p className="mt-1 text-xs text-friday-info">
                      水量：{asset.checklist.find((item) => item.item_key === "water_volume")?.value_text}
                    </p>
                  ) : null}
                </div>
                <span className="text-xs text-friday-muted">
                  {expandedAssetId === asset.id ? "收合" : "編輯"}
                </span>
              </button>

                {expandedAssetId === asset.id ? (
                  isWaterStation ? (
                    <WaterStationActions
                      project={project}
                      asset={asset}
                      onDone={onAssetUpdated}
                    />
                  ) : (
                    <AssetEditor asset={asset} project={project} onSaved={onAssetUpdated} />
                  )
                ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {subTab === "issues" ? (
        <SectionCard title="Open Issues" icon="⚠️" count={project.issues.length}>
          {project.issues.length === 0 ? (
            <p className="text-sm text-friday-muted">目前沒有 open issue。</p>
          ) : (
            <div className="space-y-3">
              {project.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-friday-border-subtle bg-friday-elevated/70 p-3"
                >
                  <p className="font-medium">{issue.title}</p>
                  {issue.description ? (
                    <p className="mt-1 text-sm text-friday-muted">{issue.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ) : null}
    </div>
  );
}

export function ProjectView({
  projects,
  loading,
  onAssetUpdated,
}: ProjectViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [focusAssetId, setFocusAssetId] = useState<number | null>(null);

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? null;

  if (loading && projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-friday-muted">
        載入專案資料…
      </div>
    );
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-4xl">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            onBack={() => {
              setSelectedId(null);
              setFocusAssetId(null);
            }}
            onAssetUpdated={onAssetUpdated}
            focusAssetId={focusAssetId}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">專案</h2>
              <p className="mt-1 text-sm text-friday-muted">
                加水站與仁大工業區固定專案，點選站點進入。
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-friday-border bg-white/70 p-8 text-center">
                <p className="font-medium">載入專案中…</p>
                <p className="mt-2 text-sm text-friday-muted">
                  固定專案會在連線後自動建立。
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.flatMap((project) => {
                  if (project.project_type === "water_station") {
                    return project.assets.map((asset) => {
                      const nextAt = asset.maintenance_schedule?.next_service_at;
                      const nextType = asset.maintenance_schedule?.next_service_type;
                      const nextLabel =
                        nextType === "major_6m"
                          ? "大保"
                          : nextType === "minor_3m"
                            ? "小保"
                            : "保養";
                      return (
                        <button
                          key={`${project.id}-${asset.id}`}
                          type="button"
                          onClick={() => {
                            setSelectedId(project.id);
                            setFocusAssetId(asset.id);
                          }}
                          className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4 text-left shadow-card transition hover:border-sky-300 hover:bg-sky-50"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-3 w-3 rounded-full ${WATER_STATION_DOT[asset.code] ?? "bg-sky-400"}`}
                            />
                            <div>
                              <p className="font-semibold text-friday-text">{asset.code}</p>
                              <p className="mt-0.5 text-xs text-friday-muted">
                                {nextAt ? `下次${nextLabel} ${nextAt}` : "加水站保養"}
                              </p>
                            </div>
                          </div>
                          <span className="text-friday-accent">→</span>
                        </button>
                      );
                    });
                  }

                  return [
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedId(project.id)}
                      className="rounded-3xl border border-friday-border-subtle bg-white/85 p-5 text-left shadow-card transition hover:border-friday-accent/30 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-friday-muted">
                            {project.template_label ?? project.project_type}
                            {project.fixed ? " · 固定專案" : ""}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{project.name}</h3>
                        </div>
                        <span className="text-friday-accent">→</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-friday-accent-soft px-2.5 py-1 text-friday-accent">
                          {project.progress.overall.display}
                        </span>
                        <span className="rounded-full bg-friday-elevated px-2.5 py-1 text-friday-muted">
                          {project.assets.length} 站點
                        </span>
                        {project.issues.length > 0 ? (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                            {project.issues.length} issue
                          </span>
                        ) : null}
                      </div>
                    </button>,
                  ];
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
