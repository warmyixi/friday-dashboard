import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;

  if (!botUrl || !apiSecret) {
    return NextResponse.json(
      { error: "server_misconfigured", message: "請設定 FRIDAY_BOT_URL 與 FRIDAY_API_SECRET" },
      { status: 500 },
    );
  }

  const { projectId } = await context.params;
  const body = await request.json();
  const target = new URL(`/api/projects/${projectId}/assets`, botUrl);

  try {
    const response = await fetch(target, {
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
