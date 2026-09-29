import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "su04chgs",
  api_key: process.env.CLOUDINARY_API_KEY || "595588247146491",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5QGigGZBi1JvWSCvk3XWMhkiW9I",
  secure: true,
});

/**
 * GET: Retrieve live Cloudinary resources and versions for tejas-elevator assets
 */
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch Cloudinary resources";
    console.error("Cloudinary resource fetch error:", error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * POST: Upload and replace an image in Cloudinary with cache invalidation
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetFilename = formData.get("targetFilename") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided for upload" },
        { status: 400 }
      );
    }

    if (!targetFilename) {
      return NextResponse.json(
        { error: "Target filename is required" },
        { status: 400 }
      );
    }

    // Clean public_id: strip extension and folder prefix if provided
    const cleanPublicId = targetFilename
      .replace(/^tejas-elevator\//, "")
      .replace(/\.[^/.]+$/, "");

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Delete existing asset first with invalidate: true to clear any old derived transformations
    try {
      await cloudinary.uploader.destroy(`tejas-elevator/${cleanPublicId}`, {
        invalidate: true,
        resource_type: "image",
      });
    } catch {
      // Ignore if not found
    }

    // Upload new image to Cloudinary with CDN cache invalidation
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tejas-elevator",
          public_id: cleanPublicId,
          use_filename: false,
          unique_filename: false,
          overwrite: true,
          invalidate: true, // Flushes Cloudinary CDN edge caches
          resource_type: "image",
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

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${targetFilename}`,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      baseName: cleanPublicId,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      version: uploadResult.version,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to upload image to Cloudinary";
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
