import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import type { Presence } from "@/lib/types";

type PresenceBadgeProps = {
  presence: Presence;
};

export function PresenceBadge({ presence }: PresenceBadgeProps) {
  const isHome = presence.is_home;
  const haLabel = presence.ha_state ?? (isHome ? "home" : "not_home");

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-friday-border-subtle bg-friday-surface/80 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isHome ? "success" : "away"}>
            {isHome ? "在家" : "外出"}
          </Badge>
          <span className="text-sm text-friday-text">
            {isHome ? "目前在家" : "目前外出"}
          </span>
        </div>
        {presence.entity_id ? (
          <p className="mt-1.5 text-xs text-friday-muted">
            HA {presence.entity_id} · {haLabel}
            {presence.source === "ha" ? "（即時同步）" : ""}
          </p>
        ) : null}
      </div>
      {presence.last_changed ? (
        <span className="shrink-0 text-xs text-friday-muted">
          {formatDateTime(presence.last_changed)}
        </span>
      ) : null}
    </div>
  );
}
