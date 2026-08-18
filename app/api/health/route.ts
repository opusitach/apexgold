import { NextResponse } from "next/server";
import { assertDbWritable } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/health — liveness probe for the container healthcheck. The site
// root only answers with a 307 into a locale, which says nothing about whether
// the server is actually able to render, so the check needs its own endpoint.
// `/api/*` is excluded from the proxy matcher, so this route is never rewritten.
//
// It also probes the leads database, because "the site renders" is not the
// property worth alerting on — a container that serves every page but cannot
// store a single application is broken in the only way that costs money, and
// without this check it stays green while the forms return 500.
export async function GET() {
  try {
    assertDbWritable();
  } catch (err) {
    console.error("Health check failed: the leads database is not writable", err);
    return NextResponse.json(
      { ok: false, error: "Leads database is not writable" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
