"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { QuickActions } from "@/components/QuickActions";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
import type { ChatMessage, CommandResponse } from "@/lib/types";
import { formatRelativeUpdate } from "@/lib/format";

type ChatPanelProps = {
  onCommandComplete?: () => void;
};

const SUGGESTIONS = [
  "幫我開主臥燈",
  "我有哪些待辦事項",
  "今天晚上十點提醒我吃肌酸",
];

function createMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function ChatPanel({ onCommandComplete }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function submitMessage(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setSending(true);
    setMessages((prev) => [...prev, createMessage("user", text)]);

    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const payload = (await response.json()) as CommandResponse;

      if (!response.ok || !payload.ok) {
        const message =
          payload.message ||
          payload.error ||
          `指令失敗（HTTP ${response.status}）`;
        setError(message);
        setMessages((prev) => [
          ...prev,
          createMessage("assistant", `❌ ${message}`),
        ]);
        return;
      }

      const replies = payload.replies?.length
        ? payload.replies
        : ["（沒有回覆內容）"];

      setMessages((prev) => [
        ...prev,
        ...replies.map((reply) => createMessage("assistant", reply)),
      ]);
      onCommandComplete?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "送出指令時發生錯誤";
      setError(message);
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", `❌ ${message}`),
      ]);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submitMessage();
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-friday-bg">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-friday-accent/15 text-2xl font-bold text-friday-accent">
                F
              </div>
              <h2 className="text-xl font-semibold text-friday-text">
                Friday
              </h2>
              <p className="mt-2 max-w-sm text-sm text-friday-muted">
                你的智慧家庭助理。輸入指令控制家電、管理待辦，或隨意聊聊。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void submitMessage(suggestion)}
                    disabled={sending}
                    className="rounded-full border border-friday-border bg-friday-panel px-3 py-1.5 text-xs text-friday-muted transition hover:border-friday-border hover:bg-friday-elevated hover:text-friday-text disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`animate-fade-in flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      message.role === "user"
                        ? "bg-friday-elevated text-friday-text"
                        : "bg-friday-accent/15 text-friday-accent"
                    }`}
                  >
                    {message.role === "user" ? "你" : "F"}
                  </div>
                  <div
                    className={`max-w-[85%] min-w-0 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === "user"
                          ? "bg-friday-elevated text-friday-text shadow-sm"
                          : "text-friday-text"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="mt-1 px-1 text-[10px] text-friday-muted">
                      {formatRelativeUpdate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {sending ? <ThinkingIndicator /> : null}
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {error ? (
        <div className="mx-auto w-full max-w-3xl px-4 pb-2 lg:px-6">
          <div className="rounded-lg border border-friday-danger/30 bg-friday-danger/10 px-3 py-2 text-xs text-friday-danger">
            {error}
          </div>
        </div>
      ) : null}

      <div className="shrink-0 border-t border-friday-border-subtle bg-friday-bg px-4 pt-3 pb-4">
        <QuickActions
          disabled={sending}
          onAction={(message) => void submitMessage(message)}
        />

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-3 max-w-3xl lg:px-2"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-friday-border bg-friday-panel p-2 shadow-composer">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false;
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" || event.shiftKey) return;
                if (
                  isComposingRef.current ||
                  event.nativeEvent.isComposing ||
                  event.keyCode === 229
                ) {
                  return;
                }
                event.preventDefault();
                void submitMessage();
              }}
              placeholder="傳送訊息給 Friday…"
              rows={1}
              disabled={sending}
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-friday-text placeholder:text-friday-muted focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="送出"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-friday-accent text-white transition hover:bg-friday-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-friday-muted">
            Enter 送出 · Shift+Enter 換行
          </p>
        </form>
      </div>
    </section>
  );
}
