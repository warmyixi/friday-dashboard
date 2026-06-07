"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Badge } from "@/components/ui/Badge";
import { useDashboard } from "@/hooks/useDashboard";
import { formatRelativeUpdate } from "@/lib/format";

export default function Dashboard() {
  const { data, error, loading, lastFetchedAt, refresh } = useDashboard();

  const connectionError = error && !data;
  const isConnected = !connectionError && (!loading || !!data);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-friday-bg">
      <header className="z-10 flex shrink-0 items-center justify-between gap-4 border-b border-friday-border-subtle bg-friday-surface/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-friday-accent/15 text-sm font-bold text-friday-accent">
            F
          </div>
          <div>
            <h1 className="text-base font-semibold text-friday-text">
              Friday Dashboard
            </h1>
            <p className="text-xs text-friday-muted">智慧家庭控制面板</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-friday-muted">
          <Badge variant={isConnected ? "success" : "muted"}>
            {connectionError
              ? "離線"
              : loading && !data
                ? "連線中"
                : "已連線"}
          </Badge>
          {lastFetchedAt ? (
            <span className="hidden sm:inline">
              更新 {formatRelativeUpdate(lastFetchedAt)}
            </span>
          ) : null}
        </div>
      </header>

      {connectionError ? (
        <div className="shrink-0 border-b border-friday-danger/20 bg-friday-danger/10 px-4 py-2.5 text-center text-sm text-friday-danger sm:px-6">
          無法取得 dashboard：{error}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 flex-1 border-b border-friday-border-subtle lg:border-b-0 lg:border-r">
          <ChatPanel onCommandComplete={refresh} />
        </div>

        <div className="h-[45vh] min-h-[280px] w-full shrink-0 bg-friday-elevated/50 lg:h-auto lg:w-[400px] xl:w-[420px]">
          <DashboardSidebar data={data} loading={loading} />
        </div>
      </div>
    </div>
  );
}
