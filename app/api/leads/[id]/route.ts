import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { updateLead, LEAD_STATUSES, type LeadStatus } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/leads/:id — admin only: change a lead's status and/or test flag.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifySession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: { status?: string; isTest?: boolean };
  try {
    body = (await request.json()) as { status?: string; isTest?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fields: { status?: LeadStatus; isTest?: boolean } = {};

  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    fields.status = body.status as LeadStatus;
  }
  if (body.isTest !== undefined) {
    if (typeof body.isTest !== "boolean") {
      return NextResponse.json({ error: "Invalid isTest" }, { status: 400 });
    }
    fields.isTest = body.isTest;
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const lead = updateLead(id, fields);
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, lead });
}
