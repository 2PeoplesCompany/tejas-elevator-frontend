import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import bundledVersions from "@/lib/media-versions.json";

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "su04chgs",
  api_key: process.env.CLOUDINARY_API_KEY || "595588247146491",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5QGigGZBi1JvWSCvk3XWMhkiW9I",
  secure: true,
});

// Cache on Vercel Edge CDN for 60 seconds to protect Cloudinary API rate limits
export const revalidate = 60;

export async function GET() {
  try {
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "tejas-elevator",
      max_results: 100,
    });

    const versions: Record<
      string,
      { version: number; format: string; url: string; updatedAt: string; bytes: number }
    > = {};

    for (const res of resources.resources) {
      const key = res.public_id.replace(/^tejas-elevator\//, "");
      versions[key] = {
        version: res.version,
        format: res.format,
        url: res.secure_url,
        updatedAt: res.created_at,
        bytes: res.bytes,
      };
    }

    return NextResponse.json({
      success: true,
      versions,
    });
  } catch (error) {
    console.warn("Falling back to bundled media-versions.json:", error);
    return NextResponse.json({
      success: true,
      versions: bundledVersions,
      fallback: true,
    });
  }
}
