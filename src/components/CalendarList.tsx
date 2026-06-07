import { formatDateTime } from "@/lib/format";
import type { CalendarItem } from "@/lib/types";

type CalendarListProps = {
  items: CalendarItem[];
  daysAhead: number;
};

export function CalendarList({ items, daysAhead }: CalendarListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        接下來 {daysAhead} 天沒有行程
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((event, index) => (
        <li
          key={event.id ?? `event-${index}`}
          className="rounded-xl border border-friday-border-subtle bg-friday-surface/60 px-3 py-2.5"
        >
          <p className="text-sm font-medium text-friday-text">{event.title}</p>
          <p className="mt-1.5 text-xs text-friday-accent">
            {event.all_day
              ? `${formatDateTime(event.start)}（全天）`
              : `${formatDateTime(event.start)} ~ ${formatDateTime(event.end)}`}
          </p>
          {event.location ? (
            <p className="mt-0.5 text-xs text-friday-muted">{event.location}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
