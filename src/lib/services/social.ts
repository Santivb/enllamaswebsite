import { businessConfig } from "@/config/business";

export type SocialPlatform = "instagram" | "facebook" | "tiktok";

export function getSocialUrl(platform: SocialPlatform): string {
  return businessConfig.social[platform] ?? "#";
}

export function isSocialConfigured(platform: SocialPlatform): boolean {
  return Boolean(businessConfig.social[platform]);
}

export type InstagramPost = {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
};

/**
 * TODO: once INSTAGRAM_GRAPH_ACCESS_TOKEN is set (and the account is linked
 * to a Facebook Page per Meta's requirements), call the Instagram Graph
 * API's `/me/media` endpoint here, map the response to InstagramPost[], and
 * add an Instagram section back to the Gallery page to render it.
 */
export async function fetchInstagramFeed(): Promise<InstagramPost[] | null> {
  const token = process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN;
  if (!token) return null;
  return null;
}
