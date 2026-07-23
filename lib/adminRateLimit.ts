import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// In-memory brute-force protection for the admin login flow.
//
// The site runs as a single long-lived `next start` process behind Caddy, so
// module-level state is shared by every request. Counters reset on restart,
// which is acceptable here: an attacker cannot force a restart, and the
// limits are tight enough that a fresh window doesn't meaningfully help.
// ---------------------------------------------------------------------------

/** Sliding window for failure counters. */
const WINDOW_MS = 15 * 60 * 1000;

/** Failed password attempts allowed per IP within the window. */
export const LOGIN_MAX_PER_IP = 5;
/**
 * Failed password attempts allowed across ALL IPs within the window. There is
 * a single admin account, so a distributed guessing attack is still aimed at
 * one password — a global cap shuts it down at the cost of possibly locking
 * the real admin out for the window too.
 */
export const LOGIN_MAX_GLOBAL = 50;
/** Failed TOTP codes allowed per IP within the window. */
export const VERIFY_MAX_PER_IP = 10;
/** Wrong TOTP codes allowed per pre-2FA token before it is burned. */
export const VERIFY_MAX_PER_TOKEN = 5;

/** Client IP as seen by Caddy (first hop of X-Forwarded-For). */
export function clientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  const first = xff?.split(",")[0].trim();
  return first || "unknown";
}

// --- Failure counters (sliding window per key) -----------------------------

const failures = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 10_000;

function recentFailures(key: string, now: number): number[] {
  const cutoff = now - WINDOW_MS;
  const kept = (failures.get(key) ?? []).filter((t) => t > cutoff);
  if (kept.length === 0) failures.delete(key);
  else failures.set(key, kept);
  return kept;
}

export function tooManyFailures(key: string, max: number): boolean {
  return recentFailures(key, Date.now()).length >= max;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  // Bound memory even if someone sprays requests from many spoofed IPs.
  if (failures.size >= MAX_TRACKED_KEYS && !failures.has(key)) {
    for (const k of failures.keys()) {
      recentFailures(k, now); // prunes the key if its window is empty
      if (failures.size < MAX_TRACKED_KEYS) break;
    }
    if (failures.size >= MAX_TRACKED_KEYS) return; // full of live entries — drop
  }
  failures.set(key, [...recentFailures(key, now), now]);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}

// --- Pre-2FA token attempt tracking ----------------------------------------
// A pre-2FA token allows a handful of TOTP guesses; after that (or after a
// successful login, to prevent replay) it is "burned" until it would have
// expired anyway.

const BURN_TTL_MS = 10 * 60 * 1000; // longer than any pre-2FA token lifetime
const MAX_TRACKED_TOKENS = 10_000;

const tokenAttempts = new Map<string, { count: number; expiresAt: number }>();
const burnedTokens = new Map<string, number>();

function pruneTokens(now: number): void {
  for (const [t, exp] of burnedTokens) if (exp <= now) burnedTokens.delete(t);
  for (const [t, e] of tokenAttempts)
    if (e.expiresAt <= now) tokenAttempts.delete(t);
}

export function isTokenBurned(token: string): boolean {
  const exp = burnedTokens.get(token);
  return exp !== undefined && exp > Date.now();
}

export function burnToken(token: string): void {
  const now = Date.now();
  pruneTokens(now);
  tokenAttempts.delete(token);
  if (burnedTokens.size < MAX_TRACKED_TOKENS)
    burnedTokens.set(token, now + BURN_TTL_MS);
}

/**
 * Count one wrong TOTP code against the token. Returns true when the token
 * has used up its attempts and has been burned.
 */
export function recordTokenAttempt(token: string): boolean {
  const now = Date.now();
  pruneTokens(now);
  const entry = tokenAttempts.get(token) ?? {
    count: 0,
    expiresAt: now + BURN_TTL_MS,
  };
  entry.count += 1;
  if (entry.count >= VERIFY_MAX_PER_TOKEN) {
    burnToken(token);
    return true;
  }
  if (tokenAttempts.size < MAX_TRACKED_TOKENS || tokenAttempts.has(token))
    tokenAttempts.set(token, entry);
  return false;
}
