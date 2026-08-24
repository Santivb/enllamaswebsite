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
  ];
}
