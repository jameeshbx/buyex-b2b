import { NextRequest, NextResponse } from "next/server";
import { deleteFromCloudinary } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "Cloudinary public ID is required" },
        { status: 400 }
      );
    }

    const success = await deleteFromCloudinary(publicId);

    if (success) {
      return NextResponse.json(
        { message: "File deleted successfully from Cloudinary" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete file from Cloudinary" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cloudinary delete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 