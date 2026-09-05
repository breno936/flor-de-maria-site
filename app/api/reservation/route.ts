import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/validation/reservation";
import { submitReservation } from "@/lib/reservation/adapter";

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Muitas tentativas. Aguarde um instante e tente novamente." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Envio inválido." }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Revise os campos destacados.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (parsed.data.company) {
    // Honeypot triggered — behave as success to not tip off bots, but never deliver.
    return NextResponse.json({ ok: true });
  }

  try {
    await submitReservation(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[reservation] falha ao encaminhar solicitação", error);
    return NextResponse.json(
      { ok: false, message: "Não conseguimos enviar agora. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}
