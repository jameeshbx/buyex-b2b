import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DocumentRole} from "@/types/prisma";
import {  Prisma } from "@prisma/client";
import { DocumentType } from "@prisma/client";

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
    const { role, userId, type, imageUrl, orderId, name, uploadedBy, comment, fileSize } = body;
    
    // Validate required fields
    if (!role || !userId || !type || !imageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: role, userId, type, and imageUrl are required" },
        { status: 400 }
      );
    }

    // If orderId is provided, verify the order exists
    if (orderId) {
      const orderExists = await db.order.findUnique({
        where: { id: orderId },
        select: { id: true }
      });
      
      if (!orderExists) {
        return NextResponse.json(
          { error: "Order not found with the provided orderId" },
          { status: 404 }
        );
      }
    }

    // For A2_FORM type, check if document already exists with same orderId and type
    if (type === 'A2_FORM' && orderId) {
      const existingDocument = await db.document.findFirst({
        where: {
          orderId: orderId,
          type: 'A2_FORM',
        },
      });

      if (existingDocument) {
        // Update existing A2_FORM document
        const document = await db.document.update({
          where: { id: existingDocument.id },
          data: {
            role: role as DocumentRole,
            userId,
            type: 'A2_FORM' as DocumentType,
            imageUrl,
            fileSize,
            name,
            uploadedBy,
            comment,
          },
        });
        return NextResponse.json(document, { status: 200 });
      }
    }

    // For all other types or new A2_FORM uploads, create a new document
    const document = await db.document.create({
      data: {
        role: role as DocumentRole,
        userId,
        type: type as DocumentType,
        imageUrl,
        fileSize,
        orderId: orderId || null, // Handle optional orderId
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
       type: { set: type } as Prisma.DocumentUpdateInput['type'],
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
