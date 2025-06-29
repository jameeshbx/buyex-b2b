import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Await the params since they're a Promise in Next.js 15+
    const { orderId } = await params;
    
    const documents = await db.document.findMany({
      where: {
        order: {
          id: orderId
        }
      },
      include: {
        order: {
          select: {
            id: true,
            studentName: true
          }
        }
      }
    });

    if (!documents || documents.length === 0) {
      return NextResponse.json(
        { error: "No documents found for this order" },
        { status: 404 }
      );
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}