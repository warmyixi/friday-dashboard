import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ projectId: string; roundId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const botUrl = process.env.FRIDAY_BOT_URL;
  const apiSecret = process.env.FRIDAY_API_SECRET;
  if (!botUrl || !apiSecret) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const { projectId, roundId } = await context.params;
  const target = new URL(
    `/api/projects/${projectId}/rounds/${roundId}/complete`,
    botUrl,
  );
  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiSecret}` },
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
