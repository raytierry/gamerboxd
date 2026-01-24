/**
 * Generates a base64-encoded SVG placeholder for use with Next.js Image's blurDataURL
 *
 * This provides a performant blur placeholder:
 * - Inline data URL (no network request)
 * - Tiny payload (~200 bytes)
 * - Native Next.js blur effect
 * - No wrapper components needed
 */

/**
 * Creates a shimmer gradient SVG placeholder
 * The gradient gives a subtle animated feel even as a static image
 */
export function getShimmerPlaceholder(
  width: number = 10,
  height: number = 14 // 2:3 aspect ratio for game covers
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#27272a"/>
          <stop offset="50%" stop-color="#3f3f46"/>
          <stop offset="100%" stop-color="#27272a"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
    </svg>
  `.trim();

  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Creates a solid color placeholder (even smaller payload)
 */
export function getSolidPlaceholder(color: string = '#27272a'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><rect fill="${color}" width="100%" height="100%"/></svg>`;

  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Pre-generated placeholder for game cover images (2:3 aspect ratio)
 * Use this constant to avoid regenerating the same placeholder
 */
export const GAME_COVER_PLACEHOLDER = getShimmerPlaceholder(10, 14);

/**
 * Pre-generated placeholder for hero/banner images (16:9 aspect ratio)
 */
export const HERO_PLACEHOLDER = getShimmerPlaceholder(16, 9);
