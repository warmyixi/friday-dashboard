"use client";

import { useState } from "react";

import { formatDateTime } from "@/lib/format";
import type { TodoItem } from "@/lib/types";

type TodoListProps = {
  items: TodoItem[];
  onChanged?: () => void;
};

export function TodoList({ items, onChanged }: TodoListProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        目前沒有待辦事項
      </p>
    );
  }

  async function handleDelete(todoId: number) {
    setBusyId(todoId);
    setError(null);
    try {
      const response = await fetch(`/api/todos/${todoId}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
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
        {items.map((todo) => (
          <li
            key={todo.id}
            className="group rounded-xl border border-friday-border-subtle bg-friday-surface/60 px-3 py-2.5 transition hover:border-friday-border hover:bg-friday-elevated/40"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed text-friday-text">
                {todo.content}
              </p>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded-md bg-friday-elevated px-1.5 py-0.5 text-[10px] text-friday-muted">
                  #{todo.id}
                </span>
                <button
                  type="button"
                  disabled={busyId === todo.id}
                  onClick={() => void handleDelete(todo.id)}
                  className="rounded-lg border border-friday-border px-2 py-0.5 text-[10px] text-friday-muted transition hover:border-friday-danger/40 hover:text-friday-danger disabled:opacity-50"
                >
                  {busyId === todo.id ? "…" : "刪除"}
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-friday-muted">
              優先 {todo.priority_label}
              {todo.due_at ? ` · ${formatDateTime(todo.due_at)}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
