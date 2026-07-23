import {
  createHmac,
  timingSafeEqual,
  randomBytes,
} from "node:crypto";

// ---------------------------------------------------------------------------
// Admin authentication: a single password + TOTP (RFC 6238) second factor,
// implemented with only Node's built-in crypto — no external packages.
//
// Secrets come from environment variables:
//   ADMIN_PASSWORD        – the login password (plain text, compared safely)
//   ADMIN_TOTP_SECRET     – base32-encoded TOTP secret (shared with the app)
//   ADMIN_SESSION_SECRET  – random key used to sign the session cookie
//
// Run `node scripts/setup-admin.mjs` to generate a ready-to-paste .env.local.
// ---------------------------------------------------------------------------

// Full session, set only after both factors pass.
export const SESSION_COOKIE = "apexgold-admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

// Short-lived token issued after step 1 (login + password), consumed by step 2
// (the 2FA code). It does NOT grant access to the panel on its own.
export const PRE2FA_COOKIE = "apexgold-admin-pre2fa";
const PRE2FA_TTL_SECONDS = 5 * 60; // 5 minutes to enter the code

const DEFAULT_USERNAME = "admin";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// --- Configuration --------------------------------------------------------

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_TOTP_SECRET &&
      process.env.ADMIN_SESSION_SECRET,
  );
}

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
}

// --- Base32 (RFC 4648) decoding for the TOTP secret -----------------------

const B32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(input: string): Buffer {
  const clean = input.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >> bits) & 0xff);
    }
  }
  return Buffer.from(out);
}

// --- TOTP verification ----------------------------------------------------

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  // Write the 64-bit counter big-endian (top 32 bits are 0 for our range).
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);

  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, "0");
}

/** Verify a 6-digit TOTP code, tolerating ±1 time step for clock drift. */
export function verifyTotp(token: string): boolean {
  const secretRaw = process.env.ADMIN_TOTP_SECRET;
  if (!secretRaw) return false;
  const cleaned = token.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;

  const secret = base32Decode(secretRaw);
  const step = Math.floor(Date.now() / 1000 / 30);
  for (let w = -1; w <= 1; w++) {
    if (safeEqual(hotp(secret, step + w), cleaned)) return true;
  }
  return false;
}

// --- Login + password (step 1) -------------------------------------------

export function verifyCredentials(username: string, password: string): boolean {
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedPass) return false;
  // Evaluate both factors either way so timing doesn't leak which one failed.
  const userOk = safeEqual(username, adminUsername());
  const passOk = safeEqual(password, expectedPass);
  return userOk && passOk;
}

// --- Signed tokens (stateless, no server-side store) ----------------------
// Format: `<purpose>.<expiry>.<hex-hmac>`. The purpose tag prevents a
// pre-2FA token from ever being accepted as a full session, and vice versa.

// Never sign or verify with a missing secret: a fallback to "" would let
// anyone forge valid-looking tokens on a misconfigured deployment.
function sign(payload: string): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function issueToken(purpose: string, ttlSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${purpose}.${exp}`;
  const sig = sign(payload);
  if (!sig) throw new Error("ADMIN_SESSION_SECRET is not set");
  return { value: `${payload}.${sig}`, maxAge: ttlSeconds };
}

function verifyToken(purpose: string, token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  if (!expected) return false;
  if (!safeEqual(sig, expected)) return false;
  if (!payload.startsWith(`${purpose}.`)) return false;
  const exp = Number(payload.slice(purpose.length + 1));
  if (!Number.isFinite(exp)) return false;
  return exp * 1000 > Date.now();
}

// Full session — issued only after both factors pass.
export function issueSession(): { value: string; maxAge: number } {
  return issueToken("session", SESSION_TTL_SECONDS);
}

export function verifySession(token: string | undefined): boolean {
  return verifyToken("session", token);
}

// Pre-2FA token — issued after step 1, consumed by step 2.
export function issuePre2fa(): { value: string; maxAge: number } {
  return issueToken("pre2fa", PRE2FA_TTL_SECONDS);
}

export function verifyPre2fa(token: string | undefined): boolean {
  return verifyToken("pre2fa", token);
}

// --- Helpers for the setup script ----------------------------------------

export function randomBase32Secret(bytes = 20): string {
  const buf = randomBytes(bytes);
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += B32_ALPHABET[(value >> bits) & 31];
    }
  }
  if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31];
  return out;
}
