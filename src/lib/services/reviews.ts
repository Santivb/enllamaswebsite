/**
 * Google Reviews scaffold — not yet active.
 * TODO: once GOOGLE_PLACES_API_KEY is set and the restaurant's Place ID is
 * known, call the Places API (Place Details, `reviews` field) here.
 */

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export function isGoogleReviewsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

export async function fetchGoogleReviews(): Promise<GoogleReview[] | null> {
  if (!isGoogleReviewsConfigured()) return null;
  // TODO: implement the Places API call once a Place ID is available.
  return null;
}
