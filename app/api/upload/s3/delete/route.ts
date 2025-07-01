import { NextRequest, NextResponse } from "next/server";
import { deleteFromS3 } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "S3 key is required" },
        { status: 400 }
      );
    }

    const success = await deleteFromS3(key);

    if (success) {
      return NextResponse.json(
        { message: "File deleted successfully from S3" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete file from S3" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("S3 delete API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 