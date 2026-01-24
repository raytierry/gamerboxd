/**
 * Converts IGDB rating (0-100) to a 5-star scale.
 * Returns null for invalid ratings.
 */
export function formatRating(rating: number | null | undefined, decimals: number = 1): string | null {
  if (!rating || rating <= 0) return null;
  return (rating / 20).toFixed(decimals);
}
