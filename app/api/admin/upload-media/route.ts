import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary with server-side credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "su04chgs",
  api_key: process.env.CLOUDINARY_API_KEY || "595588247146491",
  api_secret: process.env.CLOUDINARY_API_SECRET || "5QGigGZBi1JvWSCvk3XWMhkiW9I",
  secure: true,
});

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

    // Upload to Cloudinary with overwrite and CDN cache invalidation
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
