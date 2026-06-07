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
          bg: "#f7f7f8",
          surface: "#ffffff",
          panel: "#ffffff",
          elevated: "#f3f4f6",
          border: "#e3e3e8",
          "border-subtle": "#ececf1",
          text: "#0f172a",
          accent: "#059669",
          "accent-hover": "#047857",
          muted: "#64748b",
          success: "#16a34a",
          warn: "#d97706",
          danger: "#dc2626",
          info: "#2563eb",
          away: "#4f46e5",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.04)",
        composer:
          "0 0 0 1px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
