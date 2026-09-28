/**
 * Dynamic Media Delivery via Cloudinary CDN
 * Provides automatic format (WebP/AVIF) and quality optimization.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "su04chgs";

export function getMediaUrl(src: string): string {
  if (!src) return "";
  
  // If already an absolute URL (e.g., https://...), return as is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // If Cloudinary cloud name is active, serve via Cloudinary CDN with auto-optimization
  if (CLOUD_NAME) {
    const cleanFileName = src.replace(/^\/?(images\/)?/, "");
    // Cloudinary auto-optimization: q_auto (quality) + f_auto (format: WebP/AVIF)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/tejas-elevator/${cleanFileName}`;
  }

  return src;
}
