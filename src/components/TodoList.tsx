import { formatDateTime } from "@/lib/format";
import type { TodoItem } from "@/lib/types";

type TodoListProps = {
  items: TodoItem[];
};

export function TodoList({ items }: TodoListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-friday-border-subtle px-3 py-6 text-center text-sm text-friday-muted">
        目前沒有待辦事項
      </p>
    );
  }

  return (
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
            <span className="shrink-0 rounded-md bg-friday-elevated px-1.5 py-0.5 text-[10px] text-friday-muted">
              #{todo.id}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-friday-muted">
            優先 {todo.priority_label}
            {todo.due_at ? ` · ${formatDateTime(todo.due_at)}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
