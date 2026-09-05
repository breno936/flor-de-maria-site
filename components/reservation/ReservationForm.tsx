"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput } from "@/lib/validation/reservation";
import { reservation } from "@/data/content";
import { products } from "@/data/products";
import AtelierButton from "@/components/ui/AtelierButton";

type Status = "idle" | "submitting" | "success" | "error";

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
    defaultValues: {
      name: "",
      whatsapp: "",
      city: "",
      creation: "ainda-nao-decidi",
      occasion: "",
      desiredDate: "",
      message: "",
      consent: undefined as unknown as true,
      company: "",
    },
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
      <div className="rounded-lg border border-gold/30 bg-noir-soft p-8 text-center" role="status">
        <p className="font-display text-2xl text-ivory">{reservation.successTitle}</p>
        <p className="mt-3 font-sans text-sm text-muted">{reservation.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 rounded-[3px] border border-gold/15 bg-noir-soft/50 p-6 shadow-[0_0_0_1px_rgba(7,5,4,0.4)] sm:grid-cols-2 sm:p-8"
    >
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
          placeholder="+55 (19) 99999-9999"
          autoComplete="tel"
          className={inputClass(Boolean(errors.whatsapp))}
          {...register("whatsapp")}
        />
      </Field>

      <Field label="Cidade" htmlFor="city" error={errors.city?.message}>
        <input
          id="city"
          type="text"
          autoComplete="address-level2"
          className={inputClass(Boolean(errors.city))}
          {...register("city")}
        />
      </Field>

      <Field label="Criação desejada" htmlFor="creation" error={errors.creation?.message}>
        <select id="creation" className={inputClass(Boolean(errors.creation))} {...register("creation")}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value="ainda-nao-decidi">Ainda não decidi</option>
        </select>
      </Field>

      <Field label="Ocasião" htmlFor="occasion" error={errors.occasion?.message} optional>
        <input id="occasion" type="text" className={inputClass(Boolean(errors.occasion))} {...register("occasion")} />
      </Field>

      <Field label="Data desejada" htmlFor="desiredDate" error={errors.desiredDate?.message} optional>
        <input
          id="desiredDate"
          type="date"
          className={inputClass(Boolean(errors.desiredDate))}
          {...register("desiredDate")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Mensagem" htmlFor="message" error={errors.message?.message} optional>
          <textarea
            id="message"
            rows={4}
            className={inputClass(Boolean(errors.message))}
            {...register("message")}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 font-sans text-xs leading-relaxed text-muted">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-gold"
            {...register("consent")}
          />
          {reservation.privacyConsentLabel}
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs text-rouge" role="alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-rouge" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="sm:col-span-2">
        <AtelierButton type="submit" variant="submit" loading={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : reservation.ctaPrimary}
        </AtelierButton>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-[3px] border bg-noir-soft/80 px-4 py-3 font-sans text-sm text-ivory outline-none ring-1 ring-inset ring-transparent transition-colors placeholder:text-muted/50 focus:border-gold focus:ring-gold/30 ${
    hasError ? "border-rouge" : "border-gold/25 hover:border-gold/40"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-sans text-[11px] uppercase tracking-[0.16em] text-muted">
        {label} {optional && <span className="normal-case text-muted/60">(opcional)</span>}
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
