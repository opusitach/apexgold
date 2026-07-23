import { NextResponse, type NextRequest } from "next/server";
import { registerTelegramStart } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TelegramUpdate {
  message?: {
    text?: string;
    chat?: { id: number; type: string };
  };
}

// POST /api/telegram/webhook — Telegram calls this for every update sent to
// the bot (see scripts/setup-telegram.mjs for registering the webhook). The
// only update we care about is "/start" in a private chat: that's what
// subscribes the sender to future lead notifications.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chat = update.message?.chat;
  if (chat?.type === "private" && update.message?.text?.trim() === "/start") {
    await registerTelegramStart(String(chat.id));
  }

  // Telegram only inspects the status code; always acknowledge so it doesn't
  // keep retrying the same update.
  return NextResponse.json({ ok: true });
}
