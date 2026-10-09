import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = businessConfig.siteUrl;
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" | "yearly"
  ) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/menu", 0.9, "weekly"),
    page("/catering", 0.8, "monthly"),
    page("/contact", 0.7, "monthly"),
    page("/drinks", 0.7, "monthly"),
    page("/gallery", 0.6, "monthly"),
    page("/bulk-orders", 0.6, "monthly"),
    // /order joins the sitemap only while online ordering is on. While it is
    // paused the page is noindex (see app/order/page.tsx), and a sitemap
    // listing a noindex URL sends Google mixed signals.
    ...(businessConfig.onlineOrderingEnabled ? [page("/order", 0.8, "weekly")] : []),
    // The legal set. Low priority — nobody searches for these — but indexable
    // on purpose: a policy a customer cannot find is not a policy.
    page("/terms", 0.2, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/order-policy", 0.2, "yearly"),
  ];
}
