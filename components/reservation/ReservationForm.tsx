"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput } from "@/lib/validation/reservation";
import { reservation } from "@/data/content";
import AtelierButton from "@/components/ui/AtelierButton";

type Status = "idle" | "submitting" | "success" | "error";

const VALID_CREATIONS = new Set(reservation.creationOptions.map((o) => o.value));

export default function ReservationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [autoExpandedForError, setAutoExpandedForError] = useState(false);
  const occasionRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  // Arriving from a product CTA ("Tenho interesse nesta criação") pre-selects
  // the matching creation without touching anything the visitor has typed.
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("criacao");
    if (preset && VALID_CREATIONS.has(preset as ReservationInput["creation"])) {
      setValue("creation", preset as ReservationInput["creation"]);
    }
  }, [setValue]);

  // If a submit attempt surfaces an error inside the collapsed "details" area,
  // open it (adjusted during render, React's documented pattern for syncing
  // state to another value without an effect) and move focus there in a
  // plain effect — never hide the error from the visitor inside a closed area.
  const hasDetailError = Boolean(errors.occasion || errors.message);
  if (hasDetailError && !detailsOpen && !autoExpandedForError) {
    setDetailsOpen(true);
    setAutoExpandedForError(true);
  } else if (!hasDetailError && autoExpandedForError) {
    setAutoExpandedForError(false);
  }

  useEffect(() => {
    if (autoExpandedForError) occasionRef.current?.focus();
  }, [autoExpandedForError]);

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
      <div className="border border-gold/25 bg-noir-soft p-8 text-center" role="status">
        <p className="font-display text-2xl text-ivory">{reservation.successTitle}</p>
        <p className="mt-3 font-sans text-sm text-muted">{reservation.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative grid gap-8 border-t border-gold/15 pt-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9"
    >
      {/* Honeypot — hidden from sighted and screen-reader users, bots still fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Empresa</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="sm:col-span-2">
        <StepLabel step="01" label="Criação desejada" />
        <div role="radiogroup" aria-label="Criação desejada" className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {reservation.creationOptions.map((option) => (
            <CreationOption key={option.value} option={option} register={register} />
          ))}
        </div>
        {errors.creation && (
          <p className="mt-2 text-xs text-rouge" role="alert">
            {errors.creation.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <StepLabel step="02" label="Seus dados" />
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

      <Field label="Data desejada" htmlFor="desiredDate" error={errors.desiredDate?.message} optional>
        <input
          id="desiredDate"
          type="date"
          className={inputClass(Boolean(errors.desiredDate))}
          {...register("desiredDate")}
        />
      </Field>

      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          aria-expanded={detailsOpen}
          aria-controls="detalhes-presente"
          className="flex w-full items-center justify-between border-t border-gold/15 pt-6 text-left transition-colors hover:text-gold"
        >
          <StepLabel step="03" label={reservation.detailsToggle} as="span" />
          <span aria-hidden="true" className={`text-gold transition-transform duration-300 ${detailsOpen ? "rotate-45" : ""}`}>
            +
          </span>
        </button>

        {detailsOpen && (
          <div id="detalhes-presente" className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Ocasião" htmlFor="occasion" error={errors.occasion?.message} optional>
              <input
                id="occasion"
                type="text"
                className={inputClass(Boolean(errors.occasion))}
                {...register("occasion")}
                ref={(el) => {
                  register("occasion").ref(el);
                  occasionRef.current = el;
                }}
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
          </div>
        )}
      </div>

      <div className="sm:col-span-2 border-t border-gold/15 pt-6">
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

function StepLabel({ step, label, as = "span" }: { step: string; label: string; as?: "span" }) {
  const Tag = as;
  return (
    <Tag className="flex items-baseline gap-3 font-sans text-[11px] uppercase tracking-[0.16em] text-champagne">
      <span className="text-gold/60" aria-hidden="true">
        {step}
      </span>
      {label}
    </Tag>
  );
}

function CreationOption({
  option,
  register,
}: {
  option: { value: string; label: string };
  register: ReturnType<typeof useForm<ReservationInput>>["register"];
}) {
  return (
    <label className="group relative cursor-pointer">
      <input
        type="radio"
        value={option.value}
        className="peer sr-only"
        {...register("creation")}
      />
      <span className="flex h-full min-h-[50px] items-center justify-center border border-gold/25 px-4 py-3 text-center font-sans text-[11px] uppercase tracking-[0.14em] text-champagne/80 transition-colors peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold peer-focus-visible:outline-offset-2 group-hover:border-gold/50 group-hover:text-champagne">
        {option.label}
      </span>
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border-0 border-b bg-transparent px-0 py-2.5 font-sans text-sm text-ivory outline-none transition-colors placeholder:text-muted/40 focus:border-gold ${
    hasError ? "border-rouge" : "border-ivory/20 hover:border-ivory/35"
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
      <label htmlFor={htmlFor} className="mb-2 block font-sans text-[11px] uppercase tracking-[0.16em] text-gold/70">
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
