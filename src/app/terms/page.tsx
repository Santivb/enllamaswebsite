import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { businessConfig } from "@/config/business";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The rules for using the En Llamas 87 website, who operates it, and the limits of what is published here.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        kicker="The Fine Print"
        title="Terms of Use"
        description="The rules for using this website, in plain language."
      />

      <LegalDocument>
        <LegalSection heading="Who operates this site">
          <p>
            This website is published and operated by {legalConfig.entityName},
            located at {businessConfig.address.full}. Phone{" "}
            {businessConfig.phone}. Email{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
            .
          </p>
          <p>
            Using this site means you accept these terms. If you do not accept
            them, please do not use the site.
          </p>
        </LegalSection>

        <LegalSection heading="What this site is for">
          <p>
            To show our menu, our hours and where to find us, to take catering
            and general inquiries, and to accept online orders for pickup. You
            may use it for those purposes and for your own personal use.
          </p>
          <p>You may not:</p>
          <ul>
            <li>
              copy our photography, menu text, or branding for another business;
            </li>
            <li>
              scrape, resell, or republish the contents of this site;
            </li>
            <li>
              submit false orders, false contact details, or abusive messages;
            </li>
            <li>
              try to break, overload, or gain unauthorized access to the site.
            </li>
          </ul>
        </LegalSection>

        <LegalSection heading="Menu, prices and availability">
          <p>
            We keep the menu and prices on this site as current as we can, but
            a restaurant changes daily. Prices, items and hours can change
            without notice, and an item shown here may be sold out. Nothing on
            this site is a guarantee that a particular dish is available at a
            particular moment.
          </p>
          <p>
            Where the site and the restaurant disagree, the restaurant is
            correct. If something goes wrong with an order because of it, we
            will make it right — see the{" "}
            <Link href="/order-policy">order &amp; cancellation policy</Link>.
          </p>
        </LegalSection>

        <LegalSection heading="Food allergies">
          <p>
            Our kitchen handles nuts, dairy, gluten, shellfish and other common
            allergens, and we cannot guarantee that any dish is free of them.
            The notes field on an order helps us but is not a substitute for
            telling us directly. If you have a serious allergy, call us at{" "}
            {businessConfig.phone} before ordering.
          </p>
        </LegalSection>

        <LegalSection heading="Orders and payment">
          <p>
            Online orders, payment, cancellations and refunds are covered by our{" "}
            <Link href="/order-policy">order &amp; cancellation policy</Link>,
            which forms part of these terms.
          </p>
        </LegalSection>

        <LegalSection heading="Links to other sites">
          <p>
            Some links take you to services we do not run — delivery apps,
            social media, mapping. We are not responsible for their content or
            their terms, and their privacy practices are their own.
          </p>
        </LegalSection>

        <LegalSection heading="Our content">
          <p>
            The name, logo, photography, menu descriptions and design of this
            site belong to {legalConfig.entityName} and may not be reused
            without written permission.
          </p>
        </LegalSection>

        <LegalSection heading="Limits">
          <p>
            We publish this site in good faith and keep it accurate, but we
            provide it as it is. To the extent the law allows, we are not liable
            for losses arising from using the site itself — such as it being
            unavailable, or information on it being out of date. This does not
            limit our responsibility for the food we actually sell you, or
            anything else the law does not permit us to limit.
          </p>
        </LegalSection>

        <LegalSection heading="Questions and complaints">
          <p>
            If something on this site is wrong, or an order did not go the way
            it should have, tell us. Call {businessConfig.phone}, email{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
            , or write to us through the{" "}
            <Link href="/contact">contact form</Link>. A real person at the
            restaurant reads these.
          </p>
        </LegalSection>

        <LegalSection heading="Governing law">
          <p>
            These terms are governed by the laws of the State of{" "}
            {legalConfig.governingState}.
          </p>
        </LegalSection>
      </LegalDocument>
    </>
  );
}
