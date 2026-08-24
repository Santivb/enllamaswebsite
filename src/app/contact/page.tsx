import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import InquiryForm from "@/components/InquiryForm";
import SocialIcons from "@/components/SocialIcons";
import ServiceHours from "@/components/ServiceHours";
import PhoneLinks from "@/components/PhoneLinks";
import { businessConfig } from "@/config/business";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with En Llamas 87 in Franklin Square, NY.",
};

const mapQuery = encodeURIComponent(businessConfig.address.full);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="We'd Love to Hear From You"
        title="Contact"
        description="Questions, feedback, or a special request: send us a note and we'll get back to you."
      />

      <section className="relative bg-ink pb-28">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:px-10">
          <div>
            <h2 className="text-xs uppercase tracking-[0.25em] text-gold">
              Send a Message
            </h2>
            <div className="mt-6">
              <InquiryForm type="general" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Address
              </h3>
              <p className="mt-2 font-display text-lg text-cream">
                {businessConfig.address.line1}
                <br />
                {businessConfig.address.line2}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Email
              </h3>
              <p className="mt-2 font-sans text-sm text-cream">
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="hover:text-gold-bright"
                >
                  {businessConfig.email}
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Phone
              </h3>
              <PhoneLinks className="mt-2 font-sans text-sm text-cream" />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Hours
              </h3>
              <ServiceHours className="mt-2 max-w-sm" />
            </div>

            <div className="rounded-sm border border-gold/25 bg-charcoal/50 p-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Follow Along
              </h3>
              <p className="mt-2 font-sans text-sm text-muted">
                Find us on Instagram and Facebook.
              </p>
              <SocialIcons className="mt-4" iconClassName="h-5 w-5" />
            </div>

            <div className="relative aspect-video overflow-hidden rounded-sm border border-line">
              <iframe
                title="En Llamas 87 location map"
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                className="h-full w-full grayscale-[40%] contrast-125 invert-[0.92]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={businessConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-bright"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
