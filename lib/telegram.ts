// Mirrors new leads into Telegram. Anyone who presses "Start" on the bot (see
// the webhook route at app/api/telegram/webhook/route.ts) is recorded in
// telegram_subscribers and gets a copy of every application from then on.
//
// Sending is best-effort: a Telegram outage must never affect whether a lead
// is saved, so every failure here is caught and logged, never thrown.

import { addTelegramSubscriber, listTelegramSubscribers, type Lead } from "./db";

const API_BASE = "https://api.telegram.org";

function botToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN || null;
}

async function callTelegram(
  method: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const token = botToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`Telegram ${method} failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error(`Telegram ${method} request failed`, err);
  }
}

export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  await callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

/** Subscribe a chat and confirm it, in response to /start on the bot. */
export async function registerTelegramStart(chatId: string): Promise<void> {
  addTelegramSubscriber(chatId);
  await sendTelegramMessage(
    chatId,
    "✅ Готово! Теперь сюда будут приходить новые заявки с сайта ApexGold.",
  );
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Structured, human-readable summary of every field the visitor filled in. */
export function formatLeadMessage(lead: Lead): string {
  const lines: string[] = [`🆕 <b>Новая заявка ${esc(lead.id)}</b>`];

  const field = (label: string, value: string) => {
    if (value) lines.push(`<b>${label}:</b> ${esc(value)}`);
  };

  field("Компания", lead.company);
  field("Имя", lead.name);
  field("Телефон", lead.phone);
  field("Email", lead.email);
  if (lead.service.length) field("Услуга", lead.service.join(", "));
  field("Площадь", lead.area ? `${lead.area} м²` : "");
  field("Город", lead.city);
  field("Тип объекта", lead.objectType);
  field("Адрес", lead.address);
  field("Дата визита", lead.visitDate);
  field("Комментарий", lead.comment);

  return lines.join("\n");
}

/** Send the lead to every subscribed chat. Never throws. */
export async function notifyLeadToTelegram(lead: Lead): Promise<void> {
  const chatIds = listTelegramSubscribers();
  if (chatIds.length === 0) return;
  const text = formatLeadMessage(lead);
  await Promise.all(chatIds.map((id) => sendTelegramMessage(id, text)));
}
