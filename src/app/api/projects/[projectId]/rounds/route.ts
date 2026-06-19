import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ projectId: string }> };

async function proxy(
  projectId: string,
  path: string,
  method: "POST",
  body?: unknown,
) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;
  if (!botUrl || !apiSecret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const target = new URL(`/api/projects/${projectId}${path}`, botUrl);
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
}

export async function POST(request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const body = await request.json();
  try {
    return await proxy(projectId, "/rounds", "POST", body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
