import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { ShowcaseItem, DEFAULT_SHOWCASE_ITEMS } from "@/lib/showcase";

// Configure Cloudinary with server credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "su04chgs",
  api_key: process.env.CLOUDINARY_API_KEY || "595588247146491",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5QGigGZBi1JvWSCvk3XWMhkiW9I",
  secure: true,
});

const CONFIG_PUBLIC_ID = "tejas-elevator/showcase-config/dismissed-defaults";

/**
 * Fetch dismissed default showcase IDs from Cloudinary raw JSON
 */
async function getDismissedDefaultIds(): Promise<string[]> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "su04chgs";
    const configUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/${CONFIG_PUBLIC_ID}?t=${Date.now()}`;
    const res = await fetch(configUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("[Showcase API] Could not fetch dismissed defaults config:", err);
  }
  return [];
}

/**
 * Persist dismissed default showcase IDs back to Cloudinary raw JSON
 */
async function saveDismissedDefaultIds(ids: string[]): Promise<void> {
  const jsonStr = JSON.stringify(ids);
  const base64 = Buffer.from(jsonStr).toString("base64");
  await cloudinary.uploader.upload(`data:text/plain;base64,${base64}`, {
    public_id: CONFIG_PUBLIC_ID,
    resource_type: "raw",
    overwrite: true,
    invalidate: true,
  });
}

/**
 * Clean up title string: strips any prepended timestamps (e.g. "1790701738527_title")
 */
function sanitizeTitle(rawTitle: string | undefined, filename: string | undefined): string {
  if (rawTitle && rawTitle.trim()) {
    // Strip leading timestamp if accidentally saved into title
    return rawTitle.replace(/^\d+[-_]/, "").trim();
  }
  if (filename) {
    // Strip leading timestamp digits from filename
    return filename
      .replace(/^\d+[-_]/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }
  return "Product Showcase Installation";
}

/**
 * GET: Fetch all showcase media items (Cloudinary custom uploads + active default items)
 */
export async function GET() {
  try {
    const customItems: ShowcaseItem[] = [];

    // 1. Query Cloudinary for uploaded showcase items with full context metadata
    try {
      const searchResult = await cloudinary.search
        .expression("folder:tejas-elevator/showcase*")
        .with_field("context")
        .with_field("tags")
        .sort_by("created_at", "desc")
        .max_results(50)
        .execute();

      if (searchResult && Array.isArray(searchResult.resources)) {
        for (const res of searchResult.resources) {
          const isVideo = res.resource_type === "video";
          const context = res.context || {};
          
          const cleanTitle = sanitizeTitle(context.title, res.filename);
          const cleanCategory = context.category || "Passenger Elevators";
          const cleanDescription = context.description || "Live product installation by Tejas Elevator Engineering.";

          const thumb = isVideo
            ? res.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : res.secure_url;

          customItems.push({
            id: res.public_id,
            publicId: res.public_id,
            title: cleanTitle,
            category: cleanCategory,
            description: cleanDescription,
            mediaType: isVideo ? "video" : "image",
            url: res.secure_url,
            thumbnailUrl: thumb,
            format: res.format,
            bytes: res.bytes,
            duration: res.duration || undefined,
            createdAt: res.created_at,
            isCustomUpload: true,
          });
        }
      }
    } catch (searchErr) {
      console.warn("[Showcase API] Cloudinary search error:", searchErr);
    }

    // 2. Fetch dismissed default IDs to exclude deleted sample items
    const dismissedIds = await getDismissedDefaultIds();

    const activeDefaults = DEFAULT_SHOWCASE_ITEMS.filter(
      (item) => !dismissedIds.includes(item.id) && !dismissedIds.includes(item.publicId)
    );

    // Merge: custom uploaded items first, followed by remaining active default items
    const allItems: ShowcaseItem[] = [...customItems, ...activeDefaults];

    return NextResponse.json({
      success: true,
      items: allItems,
      customCount: customItems.length,
      defaultCount: activeDefaults.length,
      totalCount: allItems.length,
      dismissedDefaultCount: dismissedIds.length,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch showcase media";
    console.error("[Showcase GET Error]:", error);
    return NextResponse.json(
      { success: false, items: DEFAULT_SHOWCASE_ITEMS, error: errorMsg },
      { status: 200 }
    );
  }
}

/**
 * POST: Upload a new random photo or video file directly to Cloudinary showcase feed
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Check if this is a request to restore/reset default sample media
    const action = formData.get("action") as string | null;
    if (action === "restore_defaults") {
      await saveDismissedDefaultIds([]);
      return NextResponse.json({
        success: true,
        message: "Default sample showcase items restored successfully.",
      });
    }

    const file = formData.get("file") as File | null;
    const rawTitle = (formData.get("title") as string | null) || "New Product Showcase";
    const category = (formData.get("category") as string | null) || "Passenger Elevators";
    const description = (formData.get("description") as string | null) || "";

    if (!file) {
      return NextResponse.json(
        { error: "No media file provided for upload" },
        { status: 400 }
      );
    }

    const mime = file.type;
    const isImage = mime.startsWith("image/");
    const isVideo = mime.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload an image (JPG, PNG, WebP) or video (MP4, WebM)." },
        { status: 400 }
      );
    }

    const cleanTitle = rawTitle.replace(/^\d+[-_]/, "").trim();

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique public_id
    const safeSlug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueId = `${Date.now()}_${safeSlug}`;

    // Upload to Cloudinary with context metadata
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tejas-elevator/showcase",
          public_id: uniqueId,
          resource_type: "auto",
          context: {
            title: cleanTitle,
            category: category.trim(),
            description: description.trim(),
          },
          tags: ["showcase", category.trim().toLowerCase()],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    const isVideoResult = uploadResult.resource_type === "video";
    const thumbUrl = isVideoResult
      ? uploadResult.secure_url.replace(/\.[^/.]+$/, ".jpg")
      : uploadResult.secure_url;

    const newItem: ShowcaseItem = {
      id: uploadResult.public_id,
      publicId: uploadResult.public_id,
      title: cleanTitle,
      category: category.trim(),
      description: description.trim(),
      mediaType: isVideoResult ? "video" : "image",
      url: uploadResult.secure_url,
      thumbnailUrl: thumbUrl,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      duration: uploadResult.duration || undefined,
      createdAt: uploadResult.created_at,
      isCustomUpload: true,
    };

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${newItem.mediaType} "${newItem.title}" to showcase feed`,
      item: newItem,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to upload showcase media";
    console.error("[Showcase Upload Error]:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a showcase item (custom Cloudinary upload OR default sample item)
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, publicId, mediaType, isDefault } = body;

    const targetId = id || publicId;
    if (!targetId) {
      return NextResponse.json(
        { error: "Item ID or Public ID is required to delete media" },
        { status: 400 }
      );
    }

    const isDefaultItem =
      Boolean(isDefault) ||
      targetId.startsWith("default-") ||
      targetId.includes("/default-");

    if (isDefaultItem) {
      // Dismiss default sample item by adding its ID to the dismissed list
      const currentDismissed = await getDismissedDefaultIds();
      const updated = Array.from(new Set([...currentDismissed, targetId]));
      await saveDismissedDefaultIds(updated);

      return NextResponse.json({
        success: true,
        message: "Default sample photo removed from live carousel.",
        deletedId: targetId,
      });
    }

    // Delete custom uploaded asset from Cloudinary
    await cloudinary.uploader.destroy(targetId, {
      resource_type: mediaType === "video" ? "video" : "image",
      invalidate: true,
    });

    return NextResponse.json({
      success: true,
      message: `Showcase item "${targetId}" deleted from Cloudinary and removed from live carousel.`,
      deletedId: targetId,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to delete showcase media";
    console.error("[Showcase Delete Error]:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
