import { PAYMENT_METHODS, PaymentIcon } from "./PaymentIcon";

export default function PaymentMethods({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {PAYMENT_METHODS.map((method) => (
        <PaymentIcon
          key={method.id}
          id={method.id}
          className="h-6 w-9 rounded-sm border border-line/60"
        />
      ))}
      <span className="sr-only">
        Accepted payment methods: {PAYMENT_METHODS.map((m) => m.label).join(", ")}
      </span>
    </div>
  );
}
