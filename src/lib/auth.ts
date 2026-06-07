export const SESSION_COOKIE = "friday_dashboard_session";
const SESSION_SALT = "friday-dashboard-v1";

export function isAuthEnabled(): boolean {
  return Boolean(process.env.DASHBOARD_PASSWORD?.trim());
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function createSessionToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(SESSION_SALT),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionToken(
  cookieValue: string | undefined,
): Promise<boolean> {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) return true;
  if (!cookieValue) return false;

  const expected = await createSessionToken(password);
  return timingSafeEqualString(cookieValue, expected);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) return true;
  return timingSafeEqualString(input, password);
}

export async function issueSessionToken(): Promise<string> {
  const password = process.env.DASHBOARD_PASSWORD?.trim();
  if (!password) {
    throw new Error("DASHBOARD_PASSWORD is not configured");
  }
  return createSessionToken(password);
}
