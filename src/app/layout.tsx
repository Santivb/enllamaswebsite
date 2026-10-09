import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Bevan } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import ConsentProvider from "@/components/ConsentProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingSocialBar from "@/components/FloatingSocialBar";
import { PAYMENT_METHODS } from "@/components/PaymentIcon";
import { siteConfig } from "@/lib/menu-data";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Bold slab-serif badge lettering — echoes the logo's "EN LLAMAS" wordmark
// so the hero headline reads as the same brand voice, not a different font.
const bevan = Bevan({
  variable: "--font-bevan",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = siteConfig.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "En Llamas 87 | Modern Latin American Grill in Franklin Square, NY",
    template: "%s | En Llamas 87",
  },
  description:
    "En Llamas 87: Amantes de la Parrilla. A modern Latin American grill in Franklin Square, NY, built around the open flame: asados, tacos, parrillada and handcrafted Latin classics.",
  // No `alternates.canonical` here: every page would inherit it and point
  // Google at the home page. Each page sets its own through pageMeta().
  authors: [{ name: "En Llamas 87" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "En Llamas 87",
    title: "En Llamas 87 | Modern Latin American Grill in Franklin Square, NY",
    description:
      "Amantes de la Parrilla. A modern Latin American grill built around the open flame: asados, tacos, parrillada and handcrafted Latin classics in Franklin Square, NY.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "En Llamas 87" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "En Llamas 87 | Modern Latin American Grill",
    description: "Amantes de la Parrilla. Franklin Square, NY.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/logo/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/logo/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/assets/logo/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0605",
  width: "device-width",
  initialScale: 1,
};

/** "6:00 AM" -> "06:00", for schema.org opens/closes. */
function to24(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error(`Unreadable time in businessConfig.hours: "${time}"`);
  const [, h, m, ampm] = match;
  const hour = (Number(h) % 12) + (ampm.toUpperCase() === "PM" ? 12 : 0);
  return `${String(hour).padStart(2, "0")}:${m}`;
}

// Built from the same `hours` rows the footer and Visit section show, so the
// schema can never drift from the visible hours. Uses doors-open hours only.
const openingHoursSpecification = siteConfig.hours
  .filter((d) => !/closed/i.test(d.time))
  .map((d) => {
    const [opens, closes] = d.time.split(/\s*[–-]\s*/);
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${d.day}`,
      opens: to24(opens),
      closes: to24(closes),
    };
  });

// No `geo`: businessConfig holds no coordinates.
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteUrl}/#restaurant`,
  name: siteConfig.name, // PART0: 0.1, set in businessConfig.name
  // PART0: 0.1 drop or reorder these once the public name is settled.
  alternateName: ["En Llamas", "En Llamas Restaurant & Bar"],
  url: siteUrl,
  telephone: siteConfig.phoneHref.replace(/^tel:/, ""), // PART0: 0.2, set in businessConfig.phone
  image: `${siteUrl}/og-image.jpg`,
  logo: `${siteUrl}/assets/logo/favicon-512.png`,
  // Inferred from the menu prices, not from a stated range.
  priceRange: "$$",
  servesCuisine: siteConfig.servesCuisine, // PART0: 0.5, set in businessConfig.servesCuisine
  hasMenu: `${siteUrl}/menu`,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: "Franklin Square",
    addressRegion: "NY",
    postalCode: "11010",
    addressCountry: "US",
  },
  hasMap: siteConfig.googleMapsUrl,
  openingHoursSpecification,
  paymentAccepted: PAYMENT_METHODS.map((m) => m.label).join(", "),
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.googleMapsUrl].filter(Boolean),
  slogan: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${bevan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <ConsentProvider>
          <SmoothScroll>
            <Nav />
            <main id="main-content" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
            <FloatingSocialBar />
          </SmoothScroll>
        </ConsentProvider>
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
