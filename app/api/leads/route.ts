import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createLead, listLeads, type LeadInput } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "@/lib/adminAuth";
import { notifyLeadToTelegram } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/leads — public: store a submission coming from the website form.
export async function POST(request: NextRequest) {
  let body: LeadInput;
  try {
    body = (await request.json()) as LeadInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Minimal validation — the form already validates client-side, but never
  // trust that. A lead is meaningful only with a way to contact the person.
  if (!body || (!str(body.phone) && !str(body.email))) {
    return NextResponse.json(
      { error: "Phone or e-mail is required" },
      { status: 400 },
    );
  }

  const lead = createLead(body);

  // Fire-and-forget: Telegram delivery must never delay or break the
  // response the visitor is waiting on.
  notifyLeadToTelegram(lead).catch((err) =>
    console.error("Telegram lead notification failed", err),
  );

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}

// GET /api/leads — admin only: list every submission.
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: listLeads() });
}

function str(v: unknown): string {
  return v === null || v === undefined ? "" : String(v).trim();
}
