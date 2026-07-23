import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/logout — clear the session cookie and return to the login
// page. 303 forces the browser to follow up with a GET.
export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
