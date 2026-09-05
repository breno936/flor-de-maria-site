import type { ReservationInput } from "@/lib/validation/reservation";

/**
 * Delivery adapter for reservation submissions. No CRM/inbox has been
 * specified yet, so this stays configurable: set RESERVATION_WEBHOOK_URL
 * (e.g. a CRM inbound webhook, a Zapier/Make hook, or an internal API) in
 * the environment and every confirmed submission is forwarded there.
 * Until then, submissions are accepted and logged server-side so nothing
 * is silently lost, and the client still gets a real success/error state.
 */
export async function submitReservation(input: ReservationInput) {
  const webhookUrl = process.env.RESERVATION_WEBHOOK_URL;

  const payload = {
    ...input,
    source: "le-grand-amour-landing",
    submittedAt: new Date().toISOString(),
  };

  if (!webhookUrl) {
    console.info("[reservation] RESERVATION_WEBHOOK_URL not configured — logging only:", payload);
    return { delivered: false as const };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook respondeu com status ${response.status}`);
  }

  return { delivered: true as const };
}
