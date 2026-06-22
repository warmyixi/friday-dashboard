import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
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

  const target = new URL(`/api/tasks/${taskId}`, botUrl);

  try {
    const response = await fetch(target, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiSecret}` },
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "無法連線至 Friday bot";
    return NextResponse.json(
      { error: "upstream_unreachable", message },
      { status: 502 },
    );
  }
}
