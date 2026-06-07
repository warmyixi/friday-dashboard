import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Friday Dashboard",
  description: "Friday 智慧家庭控制面板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="font-sans">{children}</body>
    </html>
  );
}
