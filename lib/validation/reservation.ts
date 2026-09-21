import { z } from "zod";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Simplified to the two fields the client's approved direction asks for:
 * Nome and WhatsApp. WhatsApp accepts any formatting (spaces, parens,
 * dashes, optional +55 country code) — validated by digit count (10–13),
 * not by a rigid pattern, since the form applies a Brazilian phone mask
 * client-side but must still accept a pasted or unmasked value.
 */
export const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Informe um WhatsApp válido.")
    .refine((value) => {
      const digits = digitsOnly(value);
      return digits.length >= 10 && digits.length <= 13;
    }, "Informe um WhatsApp válido, com DDD."),
  /** Honeypot — must stay empty. Bots fill hidden fields. Never rendered visibly. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
