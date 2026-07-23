import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/health — liveness probe for the container healthcheck. The site
// root only answers with a 307 into a locale, which says nothing about whether
// the server is actually able to render, so the check needs its own endpoint.
// `/api/*` is excluded from the proxy matcher, so this route is never rewritten.
export async function GET() {
  return NextResponse.json({ ok: true });
}
