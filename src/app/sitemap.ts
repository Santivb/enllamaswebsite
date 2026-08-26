import type { MetadataRoute } from "next";
import { businessConfig } from "@/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = businessConfig.siteUrl;
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // The legal set. Low priority — nobody searches for these — but indexable
    // on purpose: a policy a customer cannot find is not a policy.
    ...["/terms", "/privacy", "/order-policy"].map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
