import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating/updating a sender
const senderSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentEmailOriginal: z.string().email("Invalid email format"),
  studentEmailFake: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  nationality: z.string().default("indian"),
  relationship: z.string().default("self"),
  senderName: z.string().optional(),
  bankCharges: z.string().optional(),
  dob: z.string().optional(),
  senderNationality: z.string().optional(),
  senderEmail: z.string().email("Invalid email format").optional(),
  sourceOfFunds: z.string().optional(),
  occupationStatus: z.string().optional(),
  senderAddressLine1: z.string().optional(),
  senderAddressLine2: z.string().optional(),
  senderState: z.string().optional(),
  senderPostalCode: z.string().optional(),
  status: z.string().default("pending"),
});

// GET /api/senders/[id] - Get a single sender
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sender = await db.sender.findUnique({
      where: {
        id: (await params).id,
      },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    return NextResponse.json(sender);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Failed to fetch sender:", error);
    return NextResponse.json(
      { error: "Failed to fetch sender" },
      { status: 500 }
    );
  }
}

// PUT /api/senders/[id] - Update a sender
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const json = await request.json();
    const body = senderSchema.parse(json);

    const sender = await db.sender.update({
      where: {
        id: (await params).id,
      },
      data: body,
    });

    return NextResponse.json(sender);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Failed to update sender:", error);
    return NextResponse.json(
      { error: "Failed to update sender" },
      { status: 500 }
    );
  }
}

// DELETE /api/senders/[id] - Delete a sender
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.sender.delete({
      where: {
        id: (await params).id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("Failed to delete sender:", error);
    return NextResponse.json(
      { error: "Failed to delete sender" },
      { status: 500 }
    );
  }
}
