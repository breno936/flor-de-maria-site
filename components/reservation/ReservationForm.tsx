"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput } from "@/lib/validation/reservation";
import { compra } from "@/data/content";
import AtelierButton from "@/components/ui/AtelierButton";
import { CTA_LABEL } from "@/components/cta/StartServiceCTA";

type Status = "idle" | "submitting" | "success" | "error";

/** Brazilian phone mask: (DD) DDDDD-DDDD (mobile) or (DD) DDDD-DDDD (fixed). */
function formatBRPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Etapa 06 — COMPRA. Two visible fields only (Nome, WhatsApp) — everything
 * else the previous form asked (cidade, criação, ocasião, data, mensagem,
 * consentimento) has been removed from the interface per the client's
 * approved direction. The honeypot stays, invisible and non-tabbable, for
 * spam protection; nothing else is required before the first contact.
 */
export default function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { name: "", whatsapp: "", company: "" },
  });

  const onSubmit = async (data: ReservationInput) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setStatus("error");
        setErrorMessage(result.message ?? "Não conseguimos enviar agora. Tente novamente.");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setErrorMessage("Falha de conexão. Verifique sua internet e tente novamente.");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-oxblood/20 bg-ivory p-8 text-center sm:p-10" role="status">
        <p className="font-display text-2xl text-noir">{compra.successTitle}</p>
        <p className="mt-3 font-sans text-sm text-noir/60">{compra.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative flex flex-col gap-6 bg-ivory p-7 sm:p-8 lg:p-16">
      {/* Honeypot — hidden from sighted and screen-reader users, bots still fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Empresa</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <Field label="Nome" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClass(Boolean(errors.name))}
          {...register("name")}
        />
      </Field>

      <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp?.message}>
        <input
          id="whatsapp"
          type="tel"
          inputMode="tel"
          placeholder="(19) 99999-9999"
          autoComplete="tel"
          className={inputClass(Boolean(errors.whatsapp))}
          {...register("whatsapp", {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              event.target.value = formatBRPhone(event.target.value);
            },
          })}
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-rouge" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-1">
        <AtelierButton type="submit" variant="submit" loading={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : CTA_LABEL}
        </AtelierButton>
        <p className="mt-4 font-sans text-xs leading-relaxed text-noir/50">{compra.note}</p>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  // min-h-[56px] + a single bottom border only — no box around the field.
  return `block min-h-[56px] w-full border-0 border-b bg-transparent px-0 py-3 font-sans text-sm text-noir outline-none transition-colors placeholder:text-noir/30 focus:border-[#70111d] ${
    hasError ? "border-rouge" : "border-[rgba(112,17,29,0.25)] hover:border-[rgba(112,17,29,0.45)]"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-oxblood/80">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rouge" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
