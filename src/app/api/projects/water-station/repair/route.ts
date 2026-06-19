import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;
  if (!botUrl || !apiSecret) {
    return NextResponse.json(
      { error: "server_misconfigured", message: "請設定 FRIDAY_BOT_URL 與 FRIDAY_API_SECRET" },
      { status: 500 },
    );
  }
  try {
    const body = await request.json();
    const response = await fetch(new URL("/api/projects/water-station/repair", botUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法連線至 Friday bot";
    return NextResponse.json({ error: "upstream_unreachable", message }, { status: 502 });
  }
}
