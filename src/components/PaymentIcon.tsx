export type PaymentMethodId = "cash" | "visa" | "mastercard" | "amex";

export const PAYMENT_METHODS: { id: PaymentMethodId; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "American Express" },
];

/** Simplified, hand-drawn card-network badges (not the official trademarked artwork). */
export function PaymentIcon({
  id,
  className,
}: {
  id: PaymentMethodId;
  className?: string;
}) {
  switch (id) {
    case "cash":
      return (
        <svg viewBox="0 0 48 32" className={className}>
          <rect x="1" y="1" width="46" height="30" rx="4" fill="#D4A24C" stroke="#8a6a2a" />
          <circle cx="24" cy="16" r="8" fill="none" stroke="#2b1d08" strokeWidth="1.5" />
          <text
            x="24"
            y="20"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#2b1d08"
            fontFamily="Georgia, serif"
          >
            $
          </text>
        </svg>
      );
    case "visa":
      return (
        <svg viewBox="0 0 48 32" className={className}>
          <rect x="1" y="1" width="46" height="30" rx="4" fill="#1A1F71" />
          <text
            x="24"
            y="21"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fontStyle="italic"
            fill="#ffffff"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 48 32" className={className}>
          <rect x="1" y="1" width="46" height="30" rx="4" fill="#16171b" />
          <circle cx="19" cy="16" r="9" fill="#EB001B" />
          <circle cx="29" cy="16" r="9" fill="#F79E1B" />
          <path
            d="M24 9.4a9 9 0 0 1 0 13.2 9 9 0 0 1 0-13.2Z"
            fill="#FF5F00"
          />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 48 32" className={className}>
          <rect x="1" y="1" width="46" height="30" rx="4" fill="#006FCF" />
          <text
            x="24"
            y="20"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#ffffff"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            AMEX
          </text>
        </svg>
      );
  }
}
