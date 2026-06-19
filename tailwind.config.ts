import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "PingFang TC",
          "Noto Sans TC",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        friday: {
          bg: "#eef2f6",
          "bg-accent": "#e8f5ef",
          surface: "rgba(255,255,255,0.88)",
          panel: "#ffffff",
          elevated: "#f8fafc",
          border: "rgba(15,23,42,0.08)",
          "border-subtle": "rgba(15,23,42,0.05)",
          text: "#0f172a",
          accent: "#059669",
          "accent-hover": "#047857",
          "accent-soft": "rgba(5,150,105,0.12)",
          muted: "#64748b",
          success: "#16a34a",
          warn: "#d97706",
          danger: "#dc2626",
          info: "#2563eb",
          away: "#4f46e5",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
        nav: "0 -8px 24px rgba(15,23,42,0.06)",
        composer:
          "0 0 0 1px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
