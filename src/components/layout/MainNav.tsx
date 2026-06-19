"use client";

import type { MainTab } from "@/lib/navigation";
import { MAIN_TABS } from "@/lib/navigation";

type MainNavProps = {
  active: MainTab;
  onChange: (tab: MainTab) => void;
  variant: "bottom" | "side";
};

export function MainNav({ active, onChange, variant }: MainNavProps) {
  if (variant === "side") {
    return (
      <nav className="flex flex-col gap-1 p-3">
        {MAIN_TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-2xl px-4 py-3 text-left transition ${
                selected
                  ? "bg-friday-accent text-white shadow-card"
                  : "text-friday-muted hover:bg-friday-elevated hover:text-friday-text"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden>
                  {tab.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div
                    className={`text-xs ${
                      selected ? "text-white/80" : "text-friday-muted"
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="glass-panel safe-bottom border-t border-friday-border-subtle px-2 pt-2 shadow-nav">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {MAIN_TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center rounded-2xl px-2 py-2 transition ${
                selected
                  ? "bg-friday-accent-soft text-friday-accent"
                  : "text-friday-muted"
              }`}
            >
              <span className="text-lg" aria-hidden>
                {tab.icon}
              </span>
              <span className="mt-0.5 text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
