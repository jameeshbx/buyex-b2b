import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema for beneficiary
const beneficiarySchema = z.object({
  receiverFullName: z.string().min(1, "Receiver's full name is required"),
  receiverCountry: z.string().min(1, "Receiver's country is required"),
  address: z.string().min(1, "Address is required"),
  receiverBank: z.string().min(1, "Receiver's bank is required"),
  receiverBankAddress: z.string().min(1, "Receiver's bank address is required"),
  receiverBankCountry: z.string().min(1, "Receiver bank's country is required"),
  receiverAccount: z.string().min(1, "Receiver's account is required"),
  receiverBankSwiftCode: z
    .string()
    .min(1, "Receiver's bank swift code is required"),
  iban: z.string().optional(),
  sortCode: z.string().optional(),
  transitNumber: z.string().optional(),
  bsbCode: z.string().optional(),
  routingNumber: z.string().optional(),
  anyIntermediaryBank: z.string().default("NO"),
  intermediaryBankName: z.string().optional(),
  intermediaryBankAccountNo: z.string().optional(),
  intermediaryBankIBAN: z.string().optional(),
  intermediaryBankSwiftCode: z.string().optional(),
  totalRemittance: z.string().min(1, "Total remittance is required"),
  field70: z.string().optional(),
  status: z.boolean().default(true),
});

// GET single beneficiary
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const beneficiary = await db.beneficiary.findUnique({
      where: {
        id: (await params).id,
      },
    });

    if (!beneficiary) {
      return NextResponse.json(
        { error: "Beneficiary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(beneficiary);
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch beneficiary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT update beneficiary
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = beneficiarySchema.parse(body);

    const beneficiary = await db.beneficiary.update({
      where: {
        id: (await params).id,
      },
      data: validatedData,
    });

    return NextResponse.json(beneficiary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update beneficiary" },
      { status: 500 }
    );
  }
}

// DELETE beneficiary
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.beneficiary.delete({
      where: {
        id: (await params).id,
      },
    });

    return NextResponse.json(
      { message: "Beneficiary deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting beneficiary:", error);
    return NextResponse.json(
      {
        error: "Failed to delete beneficiary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
