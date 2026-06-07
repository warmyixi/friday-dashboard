import { NextResponse } from "next/server";

import type { DashboardSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;

  if (!botUrl || !apiSecret) {
    return NextResponse.json(
      {
        error: "server_misconfigured",
        message: "請設定 FRIDAY_BOT_URL 與 FRIDAY_API_SECRET",
      },
      { status: 500 },
    );
  }

  const target = new URL("/api/dashboard", botUrl);

  try {
    const response = await fetch(target, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
      cache: "no-store",
    });

    const body = (await response.json()) as DashboardSnapshot | { error?: string };

    if (!response.ok) {
      return NextResponse.json(body, { status: response.status });
    }

    return NextResponse.json(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "無法連線至 Friday bot";
    return NextResponse.json(
      { error: "upstream_unreachable", message },
      { status: 502 },
    );
  }
}
