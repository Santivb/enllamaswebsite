import PageHeader from "@/components/PageHeader";
import BulkOrderForm from "@/components/BulkOrderForm";
import { businessConfig } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/bulk-orders",
  "Bulk Food Orders, Franklin Square NY",
  `Order large quantities from the regular menu at En Llamas 87 in Franklin Square. One week notice preferred. Request a quote online or call ${businessConfig.phone}.`
);

export default function BulkOrdersPage() {
  return (
    <>
      <PageHeader
        kicker="Big Batches, Made to Order"
        title="Bulk Orders"
        description="Need more of what's already on the menu? Tell us what you're after and we'll follow up with a quote. 1 week notice is preferred."
      />

      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <BulkOrderForm />
        </div>
      </section>
    </>
  );
}
