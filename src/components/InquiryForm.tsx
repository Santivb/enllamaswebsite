"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { InquiryType } from "@/lib/services/email";

type Status = "idle" | "submitting" | "success" | "error" | "not-configured";

type Props = {
  type: InquiryType;
  /** Extra structured fields (party size, date, time, guest count...) to attach to the email. */
  extraDetails?: Record<string, string>;
  /** Page-specific fields (date pickers, party size, etc.) rendered above the shared fields. */
  beforeFields?: ReactNode;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
};

const inputClasses =
  "w-full rounded-sm border border-line bg-charcoal/60 px-4 py-3 font-sans text-sm text-cream placeholder:text-parchment/40 outline-none transition-colors focus:border-gold";

const labelClasses =
  "mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold";

export default function InquiryForm({
  type,
  extraDetails,
  beforeFields,
  submitLabel = "Send Inquiry",
  messageLabel = "Message",
  messagePlaceholder = "Tell us a bit about what you need...",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          message: formData.get("message"),
          details: extraDetails,
        }),
      });

      if (res.status === 503) {
        setStatus("not-configured");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">Thank you.</p>
        <p className="mt-2 font-sans text-sm text-parchment">
          Your message has been sent. We&rsquo;ll be in touch soon.
        </p>
      </div>
    );
  }

  if (status === "not-configured") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">
          Online inquiries aren&rsquo;t connected yet.
        </p>
        <p className="mt-2 font-sans text-sm text-parchment">
          {/* TODO: replace with a real phone number once confirmed (see src/config/business.ts). */}
          Please call the restaurant directly in the meantime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {beforeFields}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input id="name" name="name" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClasses}>
          Phone <span className="normal-case text-parchment/50">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" className={inputClasses} />
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          {messageLabel}{" "}
          <span className="normal-case text-parchment/50">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={messagePlaceholder}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="font-sans text-sm text-flame-red">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-gold px-8 py-3 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
