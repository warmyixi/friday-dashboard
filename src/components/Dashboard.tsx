"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChatPanel } from "@/components/ChatPanel";
import { MainNav } from "@/components/layout/MainNav";
import { HomeView } from "@/components/views/HomeView";
import { ProjectView } from "@/components/views/ProjectView";
import { SettingsView } from "@/components/views/SettingsView";
import { Badge } from "@/components/ui/Badge";
import { useDashboard } from "@/hooks/useDashboard";
import { useQuickActions } from "@/hooks/useQuickActions";
import { formatRelativeUpdate } from "@/lib/format";
import type { MainTab } from "@/lib/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>("chat");
  const { data, error, loading, lastFetchedAt, refresh } = useDashboard();
  const { actions, persist, reset } = useQuickActions();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const connectionError = error && !data;
  const isConnected = !connectionError && (!loading || !!data);

  return (
    <div className="hero-gradient flex min-h-dvh flex-col">
      <header className="glass-panel safe-top sticky top-0 z-20 border-b border-friday-border-subtle">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-friday-accent to-emerald-600 text-sm font-bold text-white shadow-card">
              F
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-friday-text">
                Friday Dashboard
              </h1>
              <p className="truncate text-xs text-friday-muted">
                智慧助理 · 專案管理 · 智慧家庭
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-friday-muted">
            <Badge variant={isConnected ? "success" : "muted"}>
              {connectionError
                ? "離線"
                : loading && !data
                  ? "連線中"
                  : "已連線"}
            </Badge>
            {lastFetchedAt ? (
              <span className="hidden md:inline">
                更新 {formatRelativeUpdate(lastFetchedAt)}
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-friday-border bg-white/70 px-3 py-1.5 transition hover:bg-white"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {connectionError ? (
        <div className="border-b border-friday-danger/20 bg-friday-danger/10 px-4 py-2.5 text-center text-sm text-friday-danger sm:px-6">
          無法取得 dashboard：{error}
        </div>
      ) : null}

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1">
        <aside className="hidden w-72 shrink-0 border-r border-friday-border-subtle lg:block">
          <MainNav active={activeTab} onChange={setActiveTab} variant="side" />
        </aside>

        <main className="min-h-0 min-w-0 flex-1">
          {activeTab === "chat" ? (
            <ChatPanel
              quickActions={actions}
              onCommandComplete={refresh}
            />
          ) : null}
          {activeTab === "home" ? (
            <HomeView data={data} loading={loading} />
          ) : null}
          {activeTab === "projects" ? (
            <ProjectView
              projects={data?.projects ?? []}
              loading={loading}
              onAssetUpdated={refresh}
              onProjectsChanged={refresh}
            />
          ) : null}
          {activeTab === "settings" ? (
            <SettingsView
              actions={actions}
              onChange={persist}
              onReset={reset}
            />
          ) : null}
        </main>
      </div>

      <div className="lg:hidden">
        <MainNav active={activeTab} onChange={setActiveTab} variant="bottom" />
      </div>
    </div>
  );
}
