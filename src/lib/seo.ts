import type { Metadata } from "next";
import { businessConfig } from "@/config/business";

const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "En Llamas 87 logo, Amantes de la Parrilla",
};

/**
 * Title, description, canonical and link-preview tags for one page.
 *
 * Next.js replaces a parent's `openGraph` object with the child's rather than
 * merging them, so every page passes the full set through here — otherwise a
 * shared link to /menu previews as the home page. The canonical lives on each
 * page on purpose: set in app/layout.tsx it would be inherited everywhere and
 * tell Google every page is a copy of the home page.
 *
 * `path` is "" for home. `absolute` skips the layout's " | En Llamas 87" title
 * template (the home title already leads with the name). Relative URLs resolve
 * against `metadataBase` in app/layout.tsx.
 */
export function pageMeta(
  path: string,
  title: string,
  description: string,
  extra: Metadata = {},
  absolute = false
): Metadata {
  const url = path || "/";
  const shareTitle = absolute ? title : `${title} | ${businessConfig.name}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: businessConfig.name,
      url,
      title: shareTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
    ...extra,
  };
}
