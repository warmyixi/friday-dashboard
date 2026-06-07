"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import {
  fanModeLabel,
  formatDateTime,
  hvacModeLabel,
} from "@/lib/format";
import type { BedroomDeviceState, HomeState } from "@/lib/types";

type HaStatusCardProps = {
  homeState: HomeState;
};

const EMPTY_BEDROOM: BedroomDeviceState = {
  floor_lamp: { state: "unknown" },
  fan: { state: "unknown", power: 0 },
  ac: {
    hvac_mode: "unknown",
    temperature: null,
    fan_mode: "unknown",
    current_temperature: null,
  },
};

function isDeviceOn(state: string): boolean {
  return state.toLowerCase() === "on";
}

function isAcOn(hvacMode: string): boolean {
  const mode = hvacMode.toLowerCase();
  return mode !== "off" && mode !== "unknown";
}

function statusBadge(state: string, acMode = false) {
  const on = acMode ? isAcOn(state) : isDeviceOn(state);
  return (
    <Badge variant={on ? "success" : "muted"}>
      {on ? "開啟" : "關閉"}
    </Badge>
  );
}

export function HaStatusCard({ homeState }: HaStatusCardProps) {
  const bedroom = homeState.bedroom ?? EMPTY_BEDROOM;
  const { floor_lamp, fan, ac } = bedroom;

  const fanPower =
    typeof fan.power === "number" && fan.power > 0 ? `${fan.power}W` : null;

  const acTemperature =
    ac.temperature != null ? `${ac.temperature}°C` : null;

  return (
    <div className="space-y-2">
      <DeviceRow
        icon="💡"
        label="站立燈"
        badge={statusBadge(floor_lamp.state)}
      />
      <DeviceRow
        icon="🌀"
        label="電風扇"
        badge={statusBadge(fan.state)}
        detail={fanPower ?? undefined}
      />
      <DeviceRow
        icon="❄️"
        label="冷氣"
        badge={statusBadge(ac.hvac_mode, true)}
        detail={
          [
            hvacModeLabel(ac.hvac_mode),
            acTemperature,
            fanModeLabel(ac.fan_mode),
          ]
            .filter(Boolean)
            .join(" · ") || undefined
        }
      />
      {ac.current_temperature != null ? (
        <p className="px-1 text-xs text-friday-muted">
          室溫 {ac.current_temperature}°C
        </p>
      ) : null}
      <p className="px-1 pt-1 text-[11px] text-friday-muted">
        更新 {formatDateTime(homeState.last_updated)}
        {homeState.last_source ? ` · ${homeState.last_source}` : ""}
      </p>
    </div>
  );
}

function DeviceRow({
  icon,
  label,
  badge,
  detail,
}: {
  icon: string;
  label: string;
  badge: ReactNode;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-friday-border-subtle bg-friday-surface/80 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden>
            {icon}
          </span>
          <span className="text-sm font-medium text-friday-text">{label}</span>
        </div>
        {detail ? (
          <p className="mt-0.5 pl-7 text-xs text-friday-muted">{detail}</p>
        ) : null}
      </div>
      {badge}
    </div>
  );
}
