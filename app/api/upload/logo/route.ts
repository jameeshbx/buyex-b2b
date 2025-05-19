import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("logo") as File;
    const organisationId = formData.get("organisationId") as string;

    if (!file || !organisationId) {
      return NextResponse.json(
        { error: "File and organisation ID are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    await writeFile(join(uploadDir, "dummy"), "").catch(() => {});

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${organisationId}_${timestamp}_${file.name}`;
    const filepath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update organisation with logo URL
    const logoUrl = `/uploads/${filename}`;
    await db.organisation.update({
      where: { id: organisationId },
      data: { logoUrl },
    });

    return NextResponse.json({ logoUrl }, { status: 200 });
  } catch (error) {
    console.error("[LOGO_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 }
    );
  }
}
