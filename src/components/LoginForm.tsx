"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(body.message ?? "登入失敗");
        return;
      }

      router.replace(from);
      router.refresh();
    } catch {
      setError("無法連線，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-friday-border-subtle bg-friday-panel p-6 shadow-card">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-friday-accent/15 text-lg font-bold text-friday-accent">
          F
        </div>
        <h1 className="mt-4 text-lg font-semibold text-friday-text">
          Friday Dashboard
        </h1>
        <p className="mt-1 text-sm text-friday-muted">請輸入存取密碼</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium text-friday-muted"
          >
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            required
            className="w-full rounded-xl border border-friday-border bg-friday-bg px-3 py-2.5 text-sm text-friday-text outline-none transition focus:border-friday-accent/50"
            placeholder="輸入 Dashboard 密碼"
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-friday-danger/30 bg-friday-danger/10 px-3 py-2 text-sm text-friday-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl bg-friday-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-friday-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "驗證中…" : "登入"}
        </button>
      </form>
    </div>
  );
}
