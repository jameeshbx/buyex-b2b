import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single downloaded quote
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = await db.downloadedQuotes.findUnique({
      where: {
        id,
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Downloaded quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch downloaded quote", message: error },
      { status: 500 }
    );
  }
}

// PATCH update downloaded quote
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { username, createdBy, quote, calculations, generatedPDF } = body;

    const updatedQuote = await db.downloadedQuotes.update({
      where: {
        id,
      },
      data: {
        username,
        createdBy,
        quote,
        calculations,
        generatedPDF,
      },
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update downloaded quote", message: error },
      { status: 500 }
    );
  }
}

// DELETE downloaded quote
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.downloadedQuotes.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Downloaded quote deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete downloaded quote", message: error },
      { status: 500 }
    );
  }
} 