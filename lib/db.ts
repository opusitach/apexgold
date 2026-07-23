import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// SQLite storage for incoming applications ("leads").
//
// We use Node's built-in `node:sqlite` (stable since Node 24) so there are no
// native dependencies to compile — the whole database is a single file on disk
// that works identically on a laptop and on the production VPS.
// ---------------------------------------------------------------------------

export type LeadStatus = "new" | "in_progress" | "done";
export const LEAD_STATUSES: LeadStatus[] = ["new", "in_progress", "done"];

/** Shape of the lead as submitted by the public form. */
export interface LeadInput {
  company?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string[] | string;
  area?: string;
  city?: string;
  objectType?: string;
  address?: string;
  visitDate?: string;
  comment?: string;
  consent?: boolean;
  lang?: string;
  /** Marketing / technical attribution (only present with cookie consent). */
  meta?: Record<string, unknown>;
}

/** Shape returned to the admin panel. */
export interface Lead {
  id: string;
  createdAt: string;
  status: LeadStatus;
  lang: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string[];
  area: string;
  city: string;
  objectType: string;
  address: string;
  visitDate: string;
  comment: string;
  consent: boolean;
  /** Manually flagged in the admin panel to separate test rows from real ones. */
  isTest: boolean;
  meta: Record<string, unknown>;
}

const DB_PATH =
  process.env.APEXGOLD_DB_PATH ||
  path.join(process.cwd(), "data", "apexgold.db");

let _db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (_db) return _db;

  mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      seq         INTEGER PRIMARY KEY AUTOINCREMENT,
      id          TEXT UNIQUE,
      created_at  TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'new',
      lang        TEXT NOT NULL DEFAULT '',
      company     TEXT NOT NULL DEFAULT '',
      name        TEXT NOT NULL DEFAULT '',
      phone       TEXT NOT NULL DEFAULT '',
      email       TEXT NOT NULL DEFAULT '',
      service     TEXT NOT NULL DEFAULT '[]',
      area        TEXT NOT NULL DEFAULT '',
      city        TEXT NOT NULL DEFAULT '',
      object_type TEXT NOT NULL DEFAULT '',
      address     TEXT NOT NULL DEFAULT '',
      visit_date  TEXT NOT NULL DEFAULT '',
      comment     TEXT NOT NULL DEFAULT '',
      consent     INTEGER NOT NULL DEFAULT 0,
      is_test     INTEGER NOT NULL DEFAULT 0,
      meta        TEXT NOT NULL DEFAULT '{}'
    );
  `);

  // Migration: add `is_test` to databases created before this column existed.
  const cols = db.prepare("PRAGMA table_info(leads)").all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === "is_test")) {
    db.exec("ALTER TABLE leads ADD COLUMN is_test INTEGER NOT NULL DEFAULT 0");
  }

  // Chat ids of whoever pressed "Start" on the Telegram bot — each one gets a
  // copy of every new lead (see lib/telegram.ts and the webhook route).
  db.exec(`
    CREATE TABLE IF NOT EXISTS telegram_subscribers (
      chat_id     TEXT PRIMARY KEY,
      created_at  TEXT NOT NULL
    );
  `);

  _db = db;
  return db;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function normalizeService(v: LeadInput["service"]): string[] {
  if (Array.isArray(v)) return v.map(str).filter(Boolean);
  const s = str(v).trim();
  return s ? [s] : [];
}

interface LeadRow {
  id: string;
  created_at: string;
  status: string;
  lang: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  area: string;
  city: string;
  object_type: string;
  address: string;
  visit_date: string;
  comment: string;
  consent: number;
  is_test: number;
  meta: string;
}

function rowToLead(row: LeadRow): Lead {
  let service: string[] = [];
  let meta: Record<string, unknown> = {};
  try {
    service = JSON.parse(row.service) as string[];
  } catch {
    service = [];
  }
  try {
    meta = JSON.parse(row.meta) as Record<string, unknown>;
  } catch {
    meta = {};
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    status: (LEAD_STATUSES.includes(row.status as LeadStatus)
      ? row.status
      : "new") as LeadStatus,
    lang: row.lang,
    company: row.company,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service,
    area: row.area,
    city: row.city,
    objectType: row.object_type,
    address: row.address,
    visitDate: row.visit_date,
    comment: row.comment,
    consent: row.consent === 1,
    isTest: row.is_test === 1,
    meta,
  };
}

const SELECT_COLS =
  "id, created_at, status, lang, company, name, phone, email, service, area, city, object_type, address, visit_date, comment, consent, is_test, meta";

/** Insert a new lead and return the stored record (with generated id). */
export function createLead(input: LeadInput): Lead {
  const db = getDb();
  const createdAt = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO leads
      (created_at, status, lang, company, name, phone, email, service, area,
       city, object_type, address, visit_date, comment, consent, meta)
    VALUES
      (?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = insert.run(
    createdAt,
    str(input.lang),
    str(input.company),
    str(input.name),
    str(input.phone),
    str(input.email),
    JSON.stringify(normalizeService(input.service)),
    str(input.area),
    str(input.city),
    str(input.objectType),
    str(input.address),
    str(input.visitDate),
    str(input.comment),
    input.consent ? 1 : 0,
    JSON.stringify(input.meta ?? {}),
  );

  const seq = Number(info.lastInsertRowid);
  const id = "AG-" + String(seq).padStart(5, "0");
  db.prepare("UPDATE leads SET id = ? WHERE seq = ?").run(id, seq);

  const row = db
    .prepare(`SELECT ${SELECT_COLS} FROM leads WHERE seq = ?`)
    .get(seq) as unknown as LeadRow;
  return rowToLead(row);
}

/** List all leads, newest first. */
export function listLeads(): Lead[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT ${SELECT_COLS} FROM leads ORDER BY seq DESC`)
    .all() as unknown as LeadRow[];
  return rows.map(rowToLead);
}

/**
 * Update a lead's editable admin fields (status and/or the test flag).
 * Returns the updated lead, or null if not found / nothing to update.
 */
export function updateLead(
  id: string,
  fields: { status?: LeadStatus; isTest?: boolean },
): Lead | null {
  const db = getDb();
  const sets: string[] = [];
  const values: (string | number)[] = [];

  if (fields.status !== undefined) {
    sets.push("status = ?");
    values.push(fields.status);
  }
  if (fields.isTest !== undefined) {
    sets.push("is_test = ?");
    values.push(fields.isTest ? 1 : 0);
  }
  if (sets.length === 0) return null;

  values.push(id);
  const info = db
    .prepare(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`)
    .run(...values);
  if (info.changes === 0) return null;

  const row = db
    .prepare(`SELECT ${SELECT_COLS} FROM leads WHERE id = ?`)
    .get(id) as unknown as LeadRow;
  return rowToLead(row);
}

/** Record a chat that pressed "Start" on the Telegram bot. Idempotent. */
export function addTelegramSubscriber(chatId: string): void {
  const db = getDb();
  db.prepare(
    "INSERT OR IGNORE INTO telegram_subscribers (chat_id, created_at) VALUES (?, ?)",
  ).run(chatId, new Date().toISOString());
}

/** All chat ids that should receive a copy of every new lead. */
export function listTelegramSubscribers(): string[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT chat_id FROM telegram_subscribers")
    .all() as unknown as { chat_id: string }[];
  return rows.map((r) => r.chat_id);
}
