"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_QUICK_ACTIONS,
  loadQuickActions,
  saveQuickActions,
  type QuickAction,
} from "@/lib/quickActions";

export function useQuickActions() {
  const [actions, setActions] = useState<QuickAction[]>(DEFAULT_QUICK_ACTIONS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setActions(loadQuickActions());
    setReady(true);
  }, []);

  const persist = useCallback((next: QuickAction[]) => {
    setActions(next);
    saveQuickActions(next);
  }, []);

  const reset = useCallback(() => {
    persist(DEFAULT_QUICK_ACTIONS);
  }, [persist]);

  return { actions, ready, persist, reset };
}
