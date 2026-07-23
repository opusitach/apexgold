import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  PRE2FA_COOKIE,
  SESSION_COOKIE,
  isAdminConfigured,
  issueSession,
  verifyPre2fa,
  verifyTotp,
} from "@/lib/adminAuth";
import {
  VERIFY_MAX_PER_IP,
  burnToken,
  clearFailures,
  clientIp,
  isTokenBurned,
  recordFailure,
  recordTokenAttempt,
  tooManyFailures,
} from "@/lib/adminRateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 2 of the login flow.
// POST /api/admin/verify — requires the pre-2FA cookie from step 1 plus a valid
// TOTP code. On success it swaps the pre-2FA cookie for the full session.
export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured." }, {
      status: 503,
    });
  }

  const pre = (await cookies()).get(PRE2FA_COOKIE)?.value;
  if (!verifyPre2fa(pre) || isTokenBurned(pre!)) {
    // Step 1 was never completed, the 5-minute window expired, or the token
    // already used up its code attempts / was consumed by a previous login.
    return NextResponse.json(
      { error: "Session expired, start again", restart: true },
      { status: 401 },
    );
  }

  // Brute-force protection for the 6-digit code: a per-IP cap on failures
  // on top of the per-token attempt limit below.
  const ipKey = `verify:ip:${clientIp(request)}`;
  if (tooManyFailures(ipKey, VERIFY_MAX_PER_IP)) {
    return NextResponse.json(
      { error: "Too many attempts, try again later" },
      { status: 429 },
    );
  }

  let body: { code?: string };
  try {
    body = (await request.json()) as { code?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!verifyTotp(body.code ?? "")) {
    recordFailure(ipKey);
    // Each pre-2FA token only grants a handful of guesses; after that the
    // attacker must pass the password step (and its limits) again.
    if (recordTokenAttempt(pre!)) {
      const res = NextResponse.json(
        { error: "Too many wrong codes, start again", restart: true },
        { status: 401 },
      );
      res.cookies.set(PRE2FA_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }
    return NextResponse.json({ error: "Wrong code" }, { status: 401 });
  }

  clearFailures(ipKey);
  // Burn the pre-2FA token server-side so deleting the cookie below is not
  // the only thing preventing its replay.
  burnToken(pre!);

  const session = issueSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });
  // Consume the pre-2FA cookie so it can't be replayed.
  res.cookies.set(PRE2FA_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
