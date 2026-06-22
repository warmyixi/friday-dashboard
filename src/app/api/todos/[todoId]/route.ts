import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ todoId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { todoId } = await context.params;
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;

  if (!botUrl || !apiSecret) {
    return NextResponse.json(
      { error: "server_misconfigured", message: "請設定 FRIDAY_BOT_URL 與 FRIDAY_API_SECRET" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(new URL(`/api/todos/${todoId}`, botUrl), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiSecret}` },
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "無法連線至 Friday bot";
    return NextResponse.json({ error: "upstream_unreachable", message }, { status: 502 });
  }
}
