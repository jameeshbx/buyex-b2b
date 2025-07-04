import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DocumentRole, DocumentType } from "@/types/prisma";

// GET all documents
export async function GET() {
  try {
    const documents = await db.document.findMany();
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error },
      { status: 500 }
    );
  }
}

// POST create new document
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, userId, type, imageUrl, orderId, name, uploadedBy, comment } = body;

    // Validate required fields
    if (!role || !userId || !type || !imageUrl || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const document = await db.document.create({
      data: {
        role: role as DocumentRole,
        userId,
        type: type as DocumentType,
        imageUrl,
        orderId,
        name,
        uploadedBy,
        comment,
      },
    });

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create document", details: error },
      { status: 500 }
    );
  }
}

// PUT update document
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, role, type, imageUrl, isVerified, name, uploadedBy, comment } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    const document = await db.document.update({
      where: { id },
      data: {
        role: role as DocumentRole,
        type: type as DocumentType,
        imageUrl,
        isVerified,
        name,
        uploadedBy,
        comment,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update document", details: error },
      { status: 500 }
    );
  }
}

// DELETE document
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await db.document.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete document", details: error },
      { status: 500 }
    );
  }
}
