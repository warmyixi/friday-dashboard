import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ assetId: string }>;
};

async function proxy(
  request: Request,
  assetId: string,
  method: "PATCH" | "DELETE",
  body?: unknown,
) {
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

  const target = new URL(`/api/projects/assets/${assetId}`, botUrl);

  try {
    const response = await fetch(target, {
      method,
      headers: {
        Authorization: `Bearer ${apiSecret}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

export async function PATCH(request: Request, context: RouteContext) {
  const { assetId } = await context.params;
  const body = await request.json();
  return proxy(request, assetId, "PATCH", body);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { assetId } = await context.params;
  return proxy(request, assetId, "DELETE");
}
