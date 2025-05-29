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

// GET all beneficiaries
export async function GET() {
  try {
    const beneficiaries = await db.beneficiary.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(beneficiaries);
  } catch (error: unknown) {
    console.error("Error fetching beneficiaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}

// POST create new beneficiary
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = beneficiarySchema.parse(body);

    const beneficiary = await db.beneficiary.create({
      data: validatedData,
    });

    return NextResponse.json(beneficiary, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create beneficiary" },
      { status: 500 }
    );
  }
}
