import { z } from "zod";

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
    .regex(/^[0-9()+\-.\s]{8,20}$/, "Use apenas números, espaços e +()-."),
  city: z.string().trim().min(2, "Informe sua cidade.").max(80, "Cidade muito longa."),
  creation: z.enum(["le-bouquet", "le-coeur-royale", "ainda-nao-decidi"], {
    message: "Selecione a criação desejada.",
  }),
  occasion: z.string().trim().max(120, "Texto muito longo.").optional().or(z.literal("")),
  desiredDate: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(600, "Mensagem muito longa.").optional().or(z.literal("")),
  consent: z.literal(true, {
    message: "É necessário autorizar o contato para prosseguir.",
  }),
  /** Honeypot — must stay empty. Bots fill hidden fields. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
