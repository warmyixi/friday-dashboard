"use client";

import { useCallback, useEffect, useState } from "react";

import type { DashboardFetchState, DashboardSnapshot } from "@/lib/types";

const POLL_INTERVAL_MS = 5000;

const initialState: DashboardFetchState = {
  data: null,
  error: null,
  loading: true,
  lastFetchedAt: null,
};

export function useDashboard() {
  const [state, setState] = useState<DashboardFetchState>(initialState);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as
        | DashboardSnapshot
        | { error?: string; message?: string };

      if (!response.ok) {
        const message =
          ("message" in payload && payload.message) ||
          ("error" in payload && payload.error) ||
          `HTTP ${response.status}`;
        setState((prev) => ({
          ...prev,
          error: message,
          loading: false,
          lastFetchedAt: new Date().toISOString(),
        }));
        return;
      }

      setState({
        data: payload as DashboardSnapshot,
        error: null,
        loading: false,
        lastFetchedAt: new Date().toISOString(),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "讀取 dashboard 失敗";
      setState((prev) => ({
        ...prev,
        error: message,
        loading: false,
        lastFetchedAt: new Date().toISOString(),
      }));
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
    const timer = window.setInterval(() => {
      void fetchDashboard();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [fetchDashboard]);

  return { ...state, refresh: fetchDashboard };
}
