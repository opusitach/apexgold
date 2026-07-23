import { NextResponse, type NextRequest } from "next/server";
import {
  PRE2FA_COOKIE,
  isAdminConfigured,
  issuePre2fa,
  verifyCredentials,
} from "@/lib/adminAuth";
import {
  LOGIN_MAX_GLOBAL,
  LOGIN_MAX_PER_IP,
  clearFailures,
  clientIp,
  recordFailure,
  tooManyFailures,
} from "@/lib/adminRateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 1 of the login flow.
// POST /api/admin/login — verify login + password. On success set a short-lived
// pre-2FA cookie; the panel is NOT unlocked until step 2 (/api/admin/verify).
export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Run scripts/setup-admin.mjs." },
      { status: 503 },
    );
  }

  // Brute-force protection: per-IP and (since there is a single admin
  // account) global caps on failed password attempts.
  const ipKey = `login:ip:${clientIp(request)}`;
  if (
    tooManyFailures(ipKey, LOGIN_MAX_PER_IP) ||
    tooManyFailures("login:global", LOGIN_MAX_GLOBAL)
  ) {
    return NextResponse.json(
      { error: "Too many attempts, try again later" },
      { status: 429 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyCredentials(body.username ?? "", body.password ?? "")) {
    recordFailure(ipKey);
    recordFailure("login:global");
    return NextResponse.json(
      { error: "Wrong login or password" },
      { status: 401 },
    );
  }

  clearFailures(ipKey);

  const pre = issuePre2fa();
  const res = NextResponse.json({ ok: true, step: "2fa" });
  res.cookies.set(PRE2FA_COOKIE, pre.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: pre.maxAge,
  });
  return res;
}
