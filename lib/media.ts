/**
 * Dynamic Media Delivery via Cloudinary CDN
 * Provides versioned asset delivery, auto format (WebP/AVIF), and quality optimization.
 */

import mediaVersions from "./media-versions.json";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "su04chgs";

/**
 * Helper to ensure any Cloudinary URL automatically receives f_auto,q_auto transformations
 * delivering modern AVIF/WebP image formats and compressed video streams.
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/f_auto") || url.includes("f_auto,") || url.includes("/q_auto")) return url;
  
  return url
    .replace("/image/upload/", "/image/upload/f_auto,q_auto/")
    .replace("/video/upload/", "/video/upload/q_auto,vc_auto/");
}

export function getMediaUrl(src: string): string {
  if (!src) return "";

  // If already an absolute URL (e.g., https://...), optimize if it points to Cloudinary
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return optimizeCloudinaryUrl(src);
  }

  // If Cloudinary cloud name is active, serve via Cloudinary CDN
  if (CLOUD_NAME) {
    const cleanFileName = src.replace(/^\/?(images\/)?/, "");
    const baseName = cleanFileName.replace(/\.[^/.]+$/, "");

    // 1. Check client-side dynamic override in localStorage (if updated in real time via admin panel)
    if (typeof window !== "undefined") {
      try {
        const liveOverrides = localStorage.getItem("tejas_media_live_versions");
        if (liveOverrides) {
          const parsed = JSON.parse(liveOverrides);
          if (parsed[baseName]?.url) {
            return optimizeCloudinaryUrl(parsed[baseName].url);
          }
        }
      } catch {
        // Fallback to static manifest
      }
    }

    // 2. Check bundled static version manifest
    const manifest = mediaVersions as Record<
      string,
      { version: number; format: string; url?: string }
    >;
    const info = manifest[baseName];

    if (info) {
      if (info.url) return optimizeCloudinaryUrl(info.url);
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/v${info.version}/tejas-elevator/${baseName}`;
    }

    // 3. Fallback
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/tejas-elevator/${cleanFileName}`;
  }

  return src;
}
