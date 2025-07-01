import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all downloaded quotes
export async function GET() {
  try {
    const quotes = await db.downloadedQuotes.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch downloaded quotes", message: error },
      { status: 500 }
    );
  }
}

// POST new downloaded quote
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, createdBy, quote, calculations, generatedPDF } = body;

    const downloadedQuote = await db.downloadedQuotes.create({
      data: {
        username,
        createdBy,
        quote,
        calculations,
        generatedPDF,
      },
    });

    return NextResponse.json(downloadedQuote);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create downloaded quote", message: error },
      { status: 500 }
    );
  }
} 