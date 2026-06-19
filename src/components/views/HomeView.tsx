"use client";

import { CalendarList } from "@/components/CalendarList";
import { HaStatusCard } from "@/components/HaStatusCard";
import { PresenceBadge } from "@/components/PresenceBadge";
import { ScheduleList } from "@/components/ScheduleList";
import { SectionCard } from "@/components/SectionCard";
import { TodoList } from "@/components/TodoList";
import { Spinner } from "@/components/ui/Spinner";
import type { DashboardSnapshot } from "@/lib/types";

type HomeViewProps = {
  data: DashboardSnapshot | null;
  loading: boolean;
};

export function HomeView({ data, loading }: HomeViewProps) {
  if (loading && !data) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-friday-muted">
        <Spinner />
        <span className="text-sm">載入生活面板…</span>
      </div>
    );
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-friday-accent to-emerald-700 p-5 text-white shadow-card">
          <p className="text-sm text-white/80">智慧家庭</p>
          <h2 className="mt-1 text-2xl font-semibold">生活總覽</h2>
          <p className="mt-2 text-sm text-white/85">
            待辦、排程、行事曆與 Home Assistant 一次掌握。
          </p>
        </div>

        <SectionCard
          title="Presence"
          icon="📍"
          className="shadow-card"
        >
          <PresenceBadge
            presence={data?.presence ?? { is_home: false, last_changed: null }}
          />
        </SectionCard>

        <SectionCard
          title="Home Assistant"
          icon="🏠"
          className="shadow-card"
        >
          {data?.home_state?.bedroom ? (
            <HaStatusCard homeState={data.home_state} />
          ) : (
            <p className="text-sm text-friday-muted">尚無設備狀態</p>
          )}
        </SectionCard>

        <SectionCard
          title="待辦事項"
          icon="📝"
          count={data?.todos.length}
          error={data?.errors.todos}
          className="shadow-card"
        >
          <TodoList items={data?.todos ?? []} />
        </SectionCard>

        <SectionCard
          title="提醒與排程"
          icon="⏰"
          count={data?.schedules.length}
          error={data?.errors.schedules}
          className="shadow-card"
        >
          <ScheduleList items={data?.schedules ?? []} />
        </SectionCard>

        <SectionCard
          title="行事曆"
          icon="📅"
          count={data?.calendar.length}
          error={data?.errors.calendar}
          className="shadow-card"
        >
          <CalendarList
            items={data?.calendar ?? []}
            daysAhead={data?.calendar_days_ahead ?? 14}
          />
        </SectionCard>
      </div>
    </div>
  );
}
