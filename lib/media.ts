/**
 * Dynamic Media Delivery via Cloudinary CDN
 * Provides versioned asset delivery, auto format (WebP/AVIF), and quality optimization.
 */

import mediaVersions from "./media-versions.json";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "su04chgs";

export function getMediaUrl(src: string): string {
  if (!src) return "";

  // If already an absolute URL (e.g., https://...), return as is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
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
            return parsed[baseName].url;
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
      if (info.url) return info.url;
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${info.version}/tejas-elevator/${baseName}.${info.format}`;
    }

    // 3. Fallback
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/tejas-elevator/${cleanFileName}`;
  }

  return src;
}
