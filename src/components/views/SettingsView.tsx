"use client";

import { useState } from "react";

import {
  createQuickAction,
  DEFAULT_QUICK_ACTIONS,
  type QuickAction,
} from "@/lib/quickActions";

type SettingsViewProps = {
  actions: QuickAction[];
  onChange: (actions: QuickAction[]) => void;
  onReset: () => void;
};

export function SettingsView({
  actions,
  onChange,
  onReset,
}: SettingsViewProps) {
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("⚡");

  function handleAdd() {
    if (!label.trim() || !message.trim()) return;
    onChange([
      ...actions,
      createQuickAction({ label, message, icon }),
    ]);
    setLabel("");
    setMessage("");
    setIcon("⚡");
  }

  function handleRemove(id: string) {
    onChange(actions.filter((action) => action.id !== id));
  }

  function handleMove(index: number, direction: -1 | 1) {
    const next = [...actions];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto px-4 py-5 lg:px-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-3xl bg-white/85 p-5 shadow-card">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="mt-2 text-sm text-friday-muted">
            自訂聊天室下方的快捷 prompt。設定會保存在這台裝置的瀏覽器。
          </p>
        </div>

        <div className="rounded-3xl border border-friday-border-subtle bg-white/85 p-5 shadow-card">
          <h3 className="text-sm font-semibold">新增快捷指令</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-[72px_1fr_1fr]">
            <label className="text-xs text-friday-muted">
              圖示
              <input
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-center text-lg"
              />
            </label>
            <label className="text-xs text-friday-muted">
              按鈕名稱
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="例如：專案進度"
                className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-friday-muted sm:col-span-1">
              送出內容
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="例如：仁大專案目前進度多少？"
                className="mt-1 w-full rounded-xl border border-friday-border px-3 py-2 text-sm"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 rounded-xl bg-friday-accent px-4 py-2 text-sm font-medium text-white hover:bg-friday-accent-hover"
          >
            新增
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-3 rounded-2xl border border-friday-border-subtle bg-white/85 p-4 shadow-card"
            >
              <span className="text-xl" aria-hidden>
                {action.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{action.label}</p>
                <p className="truncate text-sm text-friday-muted">
                  {action.message}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  className="rounded-lg border border-friday-border px-2 py-1 text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  className="rounded-lg border border-friday-border px-2 py-1 text-xs"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(action.id)}
                  className="rounded-lg border border-friday-danger/30 px-2 py-1 text-xs text-friday-danger"
                >
                  刪
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-friday-border px-4 py-2 text-sm text-friday-muted hover:bg-friday-elevated"
        >
          還原預設快捷指令（{DEFAULT_QUICK_ACTIONS.length} 項）
        </button>
      </div>
    </div>
  );
}
