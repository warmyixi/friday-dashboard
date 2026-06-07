import { NextRequest, NextResponse } from "next/server";

import {
  issueSessionToken,
  isAuthEnabled,
  SESSION_COOKIE,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ ok: true, auth: "disabled" });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "請提供密碼" },
      { status: 400 },
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { error: "invalid_password", message: "密碼錯誤" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const token = await issueSessionToken();

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
