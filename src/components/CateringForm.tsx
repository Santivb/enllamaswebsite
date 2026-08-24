"use client";

import { useState } from "react";
import InquiryForm from "./InquiryForm";

const inputClasses =
  "w-full rounded-sm border border-line bg-charcoal/60 px-4 py-3 font-sans text-sm text-cream placeholder:text-subtle outline-none transition-colors focus:border-gold";
const labelClasses = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold";

export default function CateringForm() {
  const [foodAmount, setFoodAmount] = useState("");
  const [eventDate, setEventDate] = useState("");

  return (
    <InquiryForm
      type="catering"
      submitLabel="Request Catering Quote"
      messageLabel="Tell us about your event"
      messagePlaceholder="Event type, location, any dishes you're hoping for..."
      extraDetails={{
        "Amount of Food": foodAmount || "Not specified",
        "Event Date": eventDate || "Not specified",
      }}
      beforeFields={
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="foodAmount" className={labelClasses}>
              Estimated Amount of Food
            </label>
            <input
              id="foodAmount"
              value={foodAmount}
              onChange={(e) => setFoodAmount(e.target.value)}
              placeholder="e.g. serves 25, or 3 trays of parrillada"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="eventDate" className={labelClasses}>
              Event Date
            </label>
            <input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      }
    />
  );
}
