import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary with server credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "su04chgs",
  api_key: process.env.CLOUDINARY_API_KEY || "595588247146491",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5QGigGZBi1JvWSCvk3XWMhkiW9I",
  secure: true,
});

import { ShowcaseItem, DEFAULT_SHOWCASE_ITEMS } from "@/lib/showcase";

/**
 * GET: Fetch all showcase media items (Cloudinary custom uploads + default pre-populated items)
 */
export async function GET() {
  try {
    const customItems: ShowcaseItem[] = [];

    // Query Cloudinary for uploaded showcase items in folder tejas-elevator/showcase
    try {
      const searchResult = await cloudinary.search
        .expression("folder:tejas-elevator/showcase*")
        .sort_by("created_at", "desc")
        .max_results(50)
        .execute();

      if (searchResult && Array.isArray(searchResult.resources)) {
        for (const res of searchResult.resources) {
          const isVideo = res.resource_type === "video";
          const context = res.context || {};
          
          // For video, Cloudinary automatically allows .jpg thumbnail extension
          const thumb = isVideo
            ? res.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : res.secure_url;

          customItems.push({
            id: res.public_id,
            publicId: res.public_id,
            title: context.title || res.filename || "Product Showcase Installation",
            category: context.category || "General Showcase",
            description: context.description || "Live product installation by Tejas Elevator Engineering.",
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
      console.warn("[Showcase API] Cloudinary search fallback:", searchErr);
    }

    // Merge: custom uploaded items first, followed by default curated items
    const allItems: ShowcaseItem[] = [...customItems, ...DEFAULT_SHOWCASE_ITEMS];

    return NextResponse.json({
      success: true,
      items: allItems,
      customCount: customItems.length,
      totalCount: allItems.length,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch showcase media";
    console.error("[Showcase GET Error]:", error);
    return NextResponse.json(
      { success: false, items: DEFAULT_SHOWCASE_ITEMS, error: errorMsg },
      { status: 200 } // return 200 with default items so frontend never breaks
    );
  }
}

/**
 * POST: Upload a new random photo or video file directly to Cloudinary showcase feed
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null) || "New Product Showcase";
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

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique public_id
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueId = `${Date.now()}_${safeTitle}`;

    // Upload to Cloudinary with resource_type: auto
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tejas-elevator/showcase",
          public_id: uniqueId,
          resource_type: "auto",
          context: {
            title: title.trim(),
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
      title: title.trim(),
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
 * DELETE: Remove a custom uploaded showcase item from Cloudinary
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicId, mediaType } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required to delete media" },
        { status: 400 }
      );
    }

    // Delete asset from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: mediaType === "video" ? "video" : "image",
      invalidate: true,
    });

    return NextResponse.json({
      success: true,
      message: `Showcase item "${publicId}" deleted successfully`,
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
