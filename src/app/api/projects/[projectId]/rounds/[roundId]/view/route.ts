import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ projectId: string; roundId: string }>;
};

async function proxy(projectId: string, roundId: string, suffix: string) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;
  if (!botUrl || !apiSecret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const target = new URL(
    `/api/projects/${projectId}/rounds/${roundId}${suffix}`,
    botUrl,
  );
  const response = await fetch(target, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiSecret}` },
    cache: "no-store",
  });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { projectId, roundId } = await context.params;
  const url = new URL(request.url);
  const action = url.pathname.endsWith("/complete") ? "/complete" : "/view";
  try {
    return await proxy(projectId, roundId, action);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
