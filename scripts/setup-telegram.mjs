#!/usr/bin/env node
// ---------------------------------------------------------------------------
// One-time Telegram webhook registration.
//
//   node scripts/setup-telegram.mjs [https://apexgold.cz]
//
// Reads TELEGRAM_BOT_TOKEN from .env.local, generates a
// TELEGRAM_WEBHOOK_SECRET if one isn't already there, and registers the
// webhook with Telegram so the bot starts forwarding "/start" to
// /api/telegram/webhook. Must be run against a publicly reachable HTTPS
// domain (the deployed site) — Telegram cannot call back into localhost.
//
// Restart the app after this script writes a new secret, so the running
// server picks it up.
// ---------------------------------------------------------------------------

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
const envText = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const env = {};
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const token = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error(
    "TELEGRAM_BOT_TOKEN is not set in .env.local — add it first, then re-run.",
  );
  process.exit(1);
}

let secret = env.TELEGRAM_WEBHOOK_SECRET;
if (!secret) {
  secret = randomBytes(24).toString("hex");
  const sep = envText.length && !envText.endsWith("\n") ? "\n" : "";
  writeFileSync(
    envPath,
    envText + sep + `TELEGRAM_WEBHOOK_SECRET=${secret}\n`,
    { mode: 0o600 },
  );
  console.log("Generated TELEGRAM_WEBHOOK_SECRET and appended it to .env.local");
}

const domain = (process.argv[2] || "https://apexgold.cz").replace(/\/$/, "");
const url = `${domain}/api/telegram/webhook`;

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, secret_token: secret }),
});
const data = await res.json();

console.log("\n================  Telegram webhook setup  ================\n");
if (data.ok) {
  console.log("  Webhook registered ✓");
  console.log("  URL:", url);
} else {
  console.error("  Failed:", data);
  process.exit(1);
}
console.log("\n  Restart the app if TELEGRAM_WEBHOOK_SECRET was just generated.");
console.log("  Then open your bot in Telegram and press Start —");
console.log("  new leads will start arriving in that chat.\n");
console.log("=============================================================\n");
