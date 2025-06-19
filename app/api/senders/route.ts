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
  mothersName: z.string().optional(),
  dob: z.string().optional(),
  senderNationality: z.string().optional(),
  senderEmail: z.string().email("Invalid email format").optional(),
  sourceOfFunds: z.string().optional(),
  occupationStatus: z.string().optional(),
  payerAccountNumber: z.string().optional(),
  payerBankName: z.string().optional(),
  senderAddressLine1: z.string().optional(),
  senderAddressLine2: z.string().optional(),
  senderState: z.string().optional(),
  senderPostalCode: z.string().optional(),
  status: z.string().default("pending"),
});

// GET /api/senders - List all senders
export async function GET() {
  try {
    const senders = await db.sender.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(senders);
  } catch (error: unknown) {
    console.error("Error fetching senders:", error);
    return NextResponse.json(
      { error: "Failed to fetch senders" },
      { status: 500 }
    );
  }
}

// POST /api/senders - Create a new sender
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = senderSchema.parse(json);

    const sender = await db.sender.create({
      data: body,
    });

    if (json.orderId) {
      await db.order.update({
        where: { id: json.orderId },
        data: { senderId: sender.id },
      });
    }

    return NextResponse.json(sender);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating sender:", error);
    return NextResponse.json(
      { error: "Failed to create sender" },
      { status: 500 }
    );
  }
}
