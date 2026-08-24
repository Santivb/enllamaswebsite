"use client";

import { useState } from "react";
import InquiryForm from "./InquiryForm";

const inputClasses =
  "w-full rounded-sm border border-line bg-charcoal/60 px-4 py-3 font-sans text-sm text-cream placeholder:text-subtle outline-none transition-colors focus:border-gold";
const labelClasses = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold";

export default function BulkOrderForm() {
  const [quantity, setQuantity] = useState("");
  const [neededBy, setNeededBy] = useState("");

  return (
    <InquiryForm
      type="bulk-order"
      submitLabel="Request a Quote"
      messageLabel="What would you like to order?"
      messagePlaceholder="Dishes, quantities, any details we should know..."
      extraDetails={{
        Quantity: quantity || "Not specified",
        "Needed By": neededBy || "Not specified",
      }}
      beforeFields={
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="quantity" className={labelClasses}>
              Estimated Quantity
            </label>
            <input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 30 tacos, 5 trays of parrillada"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="neededBy" className={labelClasses}>
              Needed By
            </label>
            <input
              id="neededBy"
              type="date"
              value={neededBy}
              onChange={(e) => setNeededBy(e.target.value)}
              className={inputClasses}
            />
            <p className="mt-2 font-sans text-sm italic text-muted">
              1 week notice preferred
            </p>
          </div>
        </div>
      }
    />
  );
}
