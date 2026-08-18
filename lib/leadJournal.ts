import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DB_PATH, type LeadInput } from "./db";

// ---------------------------------------------------------------------------
// Append-only journal of every application the site accepts.
//
// The SQLite database is the system of record, but it is a single file that
// can stop accepting writes (an unwritable bind mount, a full disk) while the
// site keeps serving pages. This journal is the safety net: the full
// submission is written to disk *before* the insert is attempted, so an
// application is recoverable even when nothing downstream worked — the
// database, the Telegram delivery, or both.
//
// One JSON object per line (JSONL), next to the database so the existing
// "copy the data directory" backup covers it too. It is never rotated or
// pruned by the app: a lead is ~1 KB and the file is meant to outlive the
// container logs, which Docker does rotate.
//
// It holds personal data (name, phone, e-mail, address), same as the database.
// ---------------------------------------------------------------------------

const JOURNAL_PATH =
  process.env.APEXGOLD_LEAD_LOG ||
  path.join(path.dirname(DB_PATH), "leads.jsonl");

function write(entry: Record<string, unknown>): void {
  const line = JSON.stringify({ at: new Date().toISOString(), ...entry });
  try {
    mkdirSync(path.dirname(JOURNAL_PATH), { recursive: true });
    appendFileSync(JOURNAL_PATH, line + "\n");
  } catch (err) {
    // The journal exists for the case where the disk misbehaves, so its own
    // failure has to leave a trace somewhere else — stdout ends up in
    // `docker compose logs app`.
    console.error("Lead journal write failed", err);
    console.error("Unjournalled entry:", line);
  }
}

/**
 * Record an incoming submission before anything can go wrong with it, and
 * return the reference that ties it to the outcome written afterwards.
 */
export function journalLeadReceived(input: LeadInput): string {
  const ref = randomUUID().slice(0, 8);
  write({ event: "received", ref, lead: input });
  console.log(`lead ${ref} received`);
  return ref;
}

/** Record that the submission made it into the database. */
export function journalLeadStored(ref: string, id: string): void {
  write({ event: "stored", ref, id });
  console.log(`lead ${ref} stored as ${id}`);
}

/** Record that the submission could not be stored, and why. */
export function journalLeadFailed(ref: string, err: unknown): void {
  write({
    event: "failed",
    ref,
    error: err instanceof Error ? err.message : String(err),
  });
}
