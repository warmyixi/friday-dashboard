import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Friday Dashboard",
  description: "Friday 智慧助理與專案管理中心",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Friday",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
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
