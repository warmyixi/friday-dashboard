import { formatDateTime } from "@/lib/format";
import type { ScheduleItem } from "@/lib/types";

type ScheduleListProps = {
  items: ScheduleItem[];
};

export function ScheduleList({ items }: ScheduleListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        目前沒有提醒或排程
      </p>
    );
  }

  return (
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
            <span className="shrink-0 rounded-md bg-friday-elevated px-1.5 py-0.5 text-[10px] text-friday-muted">
              #{job.id}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-friday-muted">
            {job.recurrence_label}
          </p>
          <p className="mt-0.5 text-xs text-friday-accent">
            下次 {formatDateTime(job.run_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}
