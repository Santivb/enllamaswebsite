import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AlcoholPolicyNotice from "@/components/AlcoholPolicyNotice";
import { drinkCategories } from "@/lib/drinks-data";

export const metadata: Metadata = {
  title: "Drinks",
  description:
    "Signature cocktails, margaritas, beer, wine, fresh juices and coffee at En Llamas 87 in Franklin Square, NY.",
};

export default function DrinksPage() {
  return (
    <>
      <PageHeader
        kicker="Behind the Bar"
        title="Drinks"
        description="Cocktails built for the table, fresh-fruit juices, and a beverage list crafted to match the fire."
      />

      <section className="relative bg-ink pb-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="flex flex-col gap-16 md:gap-20">
            {drinkCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-4">
                  <span className="divider-line flex-1" />
                  <h2 className="section-heading whitespace-nowrap text-xl md:text-2xl">
                    {category.title}
                  </h2>
                  <span className="divider-line flex-1" />
                </div>

                {category.note && (
                  <p className="mt-3 text-center font-sans text-xs uppercase tracking-[0.15em] text-gold-bright/80 md:text-sm">
                    {category.note}
                  </p>
                )}

                <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
                  {category.items.map((item) => (
                    <div key={item.name} className="border-b border-line/60 pb-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-lg text-gold-bright md:text-xl">
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="whitespace-nowrap font-display text-base text-gold md:text-lg">
                            {item.price}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-1 font-sans text-sm text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <AlcoholPolicyNotice />
        </div>
      </section>
    </>
  );
}
