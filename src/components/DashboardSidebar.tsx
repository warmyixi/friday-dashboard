"use client";

import { CalendarList } from "@/components/CalendarList";
import { HaStatusCard } from "@/components/HaStatusCard";
import { PresenceBadge } from "@/components/PresenceBadge";
import { ScheduleList } from "@/components/ScheduleList";
import { SectionCard } from "@/components/SectionCard";
import { TaskList } from "@/components/TaskList";
import { TodoList } from "@/components/TodoList";
import { Spinner } from "@/components/ui/Spinner";
import type { DashboardSnapshot } from "@/lib/types";

type DashboardSidebarProps = {
  data: DashboardSnapshot | null;
  loading: boolean;
  onRefresh?: () => void;
};

export function DashboardSidebar({ data, loading, onRefresh }: DashboardSidebarProps) {
  if (loading && !data) {
    return (
      <aside className="flex h-full flex-col items-center justify-center gap-3 p-8 text-friday-muted">
        <Spinner />
        <p className="text-sm">載入狀態面板…</p>
      </aside>
    );
  }

  return (
    <aside className="scrollbar-thin h-full overflow-y-auto p-4 lg:p-5">
      <div className="space-y-4">
        <SectionCard
          title="統一任務"
          icon="📋"
          count={data?.tasks?.length}
          error={data?.errors.tasks}
        >
          <TaskList items={data?.tasks ?? []} onChanged={onRefresh} />
        </SectionCard>

        <SectionCard
          title="待辦事項"
          icon="📝"
          count={data?.todos.length}
          error={data?.errors.todos}
        >
          <TodoList items={data?.todos ?? []} onChanged={onRefresh} />
        </SectionCard>

        <SectionCard
          title="提醒與排程"
          icon="⏰"
          count={data?.schedules.length}
          error={data?.errors.schedules}
        >
          <ScheduleList items={data?.schedules ?? []} onChanged={onRefresh} />
        </SectionCard>

        <SectionCard
          title="行事曆"
          icon="📅"
          count={data?.calendar.length}
          error={data?.errors.calendar}
        >
          <CalendarList
            items={data?.calendar ?? []}
            daysAhead={data?.calendar_days_ahead ?? 14}
            onChanged={onRefresh}
          />
        </SectionCard>

        <SectionCard title="Home Assistant" icon="🏠">
          {data?.home_state?.bedroom ? (
            <HaStatusCard homeState={data.home_state} />
          ) : (
            <p className="text-sm text-friday-muted">尚無設備狀態</p>
          )}
        </SectionCard>

        <SectionCard title="Presence" icon="📍">
          <PresenceBadge
            presence={data?.presence ?? { is_home: false, last_changed: null }}
          />
        </SectionCard>
      </div>
    </aside>
  );
}
