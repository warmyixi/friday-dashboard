import { NextResponse } from "next/server";

import type { CommandResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;

  if (!botUrl || !apiSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "server_misconfigured",
        message: "請設定 FRIDAY_BOT_URL 與 FRIDAY_API_SECRET",
        replies: [],
      },
      { status: 500 },
    );
  }

  let body: { message?: string };
  try {
    body = (await request.json()) as { message?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", replies: [] },
      { status: 400 },
    );
  }

  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "empty_message", replies: [] },
      { status: 400 },
    );
  }

  const target = new URL("/api/command", botUrl);

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      cache: "no-store",
    });

    const raw = await response.text();
    let payload: CommandResponse;
    try {
      payload = JSON.parse(raw) as CommandResponse;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "upstream_invalid_json",
          message: "Friday bot 回傳格式異常，請確認 bot 是否正常運行。",
          replies: [],
        },
        { status: 502 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(payload);
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "無法連線至 Friday bot";
    return NextResponse.json(
      {
        ok: false,
        error: "upstream_unreachable",
        message: messageText,
        replies: [],
      },
      { status: 502 },
    );
  }
}
