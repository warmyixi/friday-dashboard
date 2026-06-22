"use client";

import { useState } from "react";

import { formatDateTime } from "@/lib/format";
import type { CalendarItem } from "@/lib/types";

type CalendarListProps = {
  items: CalendarItem[];
  daysAhead: number;
  onChanged?: () => void;
};

export function CalendarList({ items, daysAhead, onChanged }: CalendarListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        接下來 {daysAhead} 天沒有行程
      </p>
    );
  }

  async function handleDelete(eventId: string) {
    setBusyId(eventId);
    setError(null);
    try {
      const response = await fetch(
        `/api/calendar/events/${encodeURIComponent(eventId)}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `HTTP ${response.status}`);
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
        {items.map((event, index) => {
          const eventId = event.id;
          const canDelete = Boolean(eventId);
          return (
            <li
              key={eventId ?? `event-${index}`}
              className="rounded-xl border border-friday-border-subtle bg-friday-surface/60 px-3 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-friday-text">{event.title}</p>
                {canDelete ? (
                  <button
                    type="button"
                    disabled={busyId === eventId}
                    onClick={() => void handleDelete(eventId!)}
                    className="shrink-0 rounded-lg border border-friday-border px-2 py-0.5 text-[10px] text-friday-muted transition hover:border-friday-danger/40 hover:text-friday-danger disabled:opacity-50"
                  >
                    {busyId === eventId ? "…" : "刪除"}
                  </button>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-friday-accent">
                {event.all_day
                  ? `${formatDateTime(event.start)}（全天）`
                  : `${formatDateTime(event.start)} ~ ${formatDateTime(event.end)}`}
              </p>
              {event.location ? (
                <p className="mt-0.5 text-xs text-friday-muted">{event.location}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
