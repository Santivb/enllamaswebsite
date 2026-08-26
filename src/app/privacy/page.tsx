import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { businessConfig } from "@/config/business";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What information En Llamas 87 collects through this website, why, who it is shared with, and how to have it deleted.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        kicker="Your Information"
        title="Privacy Policy"
        description="What we collect through this website, why we collect it, and how to have it removed."
      />

      <LegalDocument>
        <LegalSection heading="Who runs this website">
          <p>
            This website is operated by {legalConfig.entityName}, a restaurant
            at {businessConfig.address.full}. You can reach us by phone at{" "}
            {businessConfig.phone}, by email at{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
            , or through the <Link href="/contact">contact form</Link>.
          </p>
          <p>
            We are responsible for the information described on this page. If
            anything here is unclear, ask us — we would rather explain it than
            have you guess.
          </p>
        </LegalSection>

        <LegalSection heading="What we collect, and when">
          <p>
            We only collect information you type in yourself. There is no
            account to create and nothing is gathered in the background.
          </p>
          <ul>
            <li>
              <strong>Contact form</strong> — your name, email address, phone
              number if you give one, and your message.
            </li>
            <li>
              <strong>Catering and bulk order inquiries</strong> — the same
              contact details plus the event details you describe: date, guest
              count, and what you are looking for.
            </li>
            <li>
              <strong>Online orders</strong> — your name, email address, phone
              number, the items you ordered, and any notes you add for the
              kitchen. Card details go straight to our payment processor and
              never reach this website or our inbox.
            </li>
          </ul>
        </LegalSection>

        <LegalSection heading="Why we collect it">
          <p>
            To answer your message, to quote and schedule catering, and to
            prepare and hand over the food you ordered. We do not build
            marketing profiles and we do not send promotional email unless you
            have asked us to.
          </p>
        </LegalSection>

        <LegalSection heading="Who else sees it">
          <p>
            Only the services that make the site work, and only the part each
            one needs:
          </p>
          <ul>
            <li>
              <strong>Our payment processor (Stripe)</strong> — handles card
              payments for online orders. Stripe receives your card details
              directly and processes them under its own privacy policy.
            </li>
            <li>
              <strong>Our email provider</strong> — delivers form submissions
              and order confirmations to the restaurant&apos;s inbox.
            </li>
            <li>
              <strong>Our website host</strong> — serves the pages and keeps
              standard server logs.
            </li>
          </ul>
          <p>
            We do not sell your information, rent it, or trade it. We share it
            outside these services only if the law requires it.
          </p>
        </LegalSection>

        <LegalSection heading="Cookies and tracking">
          <p>
            <strong>
              This site does not use analytics, advertising, or profiling
              cookies.
            </strong>{" "}
            There is no Google Analytics, no advertising pixel, and no social
            media tracker on any page.
          </p>
          <p>
            Two things do involve another company, and only on the pages where
            they appear:
          </p>
          <ul>
            <li>
              <strong>Online checkout</strong> — our payment processor sets its
              own cookies on the checkout page to keep your payment secure and
              detect fraud. Those are required for payment to work.
            </li>
            <li>
              <strong>The embedded map</strong> — the Google map on the home
              page and the contact page loads from Google, which can see your
              IP address and set its own cookies. It does not load unless you
              allow it: until you do, no request reaches Google at all and we
              show the address in plain text instead.
            </li>
          </ul>
          <p>
            That is what the notice at the bottom of the screen on your first
            visit is asking about, and it is the only thing it asks about.
            Choosing &ldquo;Essential Only&rdquo; leaves the map unloaded.
            You can change your mind at any time with the{" "}
            <strong>Cookie Choices</strong> link in the footer of every page.
          </p>
          <p>
            Your answer is stored in your browser&apos;s own local storage
            rather than in a cookie, so it is never sent to us and never
            leaves your device. Clearing your browsing data removes it, and
            the notice appears again on your next visit.
          </p>
        </LegalSection>

        <LegalSection heading="How long we keep it">
          <p>
            Inquiries stay in the restaurant&apos;s email for as long as they
            are useful for answering you and handling any follow-up. Order
            records are kept as long as we need them for our books and tax
            records. When information is no longer needed for either, it is
            deleted.
          </p>
        </LegalSection>

        <LegalSection heading="Your choices">
          <p>You can ask us at any time to:</p>
          <ul>
            <li>tell you what information about you we hold;</li>
            <li>correct anything that is wrong;</li>
            <li>
              delete it, unless we are required to keep it for tax or
              accounting reasons;
            </li>
            <li>stop contacting you.</li>
          </ul>
          <p>
            Email{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>{" "}
            or use the <Link href="/contact">contact form</Link>. We will
            respond as quickly as we reasonably can.
          </p>
        </LegalSection>

        <LegalSection heading="Children">
          <p>
            This site is meant for adults ordering food. We do not knowingly
            collect information from children under 13. If you believe a child
            has sent us information, contact us and we will delete it.
          </p>
        </LegalSection>

        <LegalSection heading="Changes to this policy">
          <p>
            If we change how we handle your information, we will update this
            page and change the date at the top. The version published here is
            always the one that applies.
          </p>
        </LegalSection>
      </LegalDocument>
    </>
  );
}
