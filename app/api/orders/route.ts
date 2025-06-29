import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      purpose,
      foreignBankCharges,
      payer,
      forexPartner,
      margin,
      receiverBankCountry,
      studentName,
      consultancy,
      ibrRate,
      amount,
      currency,
      totalAmount,
      customerRate,
      status,
      createdBy,
      quote,
      calculations,
      generatedPDF,
    } = body;

    if (
      !purpose ||
      !payer ||
      !forexPartner ||
      !receiverBankCountry ||
      !studentName ||
      !consultancy ||
      !amount ||
      !totalAmount ||
      !createdBy ||
      !quote ||
      !calculations ||
      !generatedPDF
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const order = await db.order.create({
      data: {
        purpose,
        foreignBankCharges: parseFloat(foreignBankCharges) || 0,
        payer,
        forexPartner,
        margin: parseFloat(margin) || 0,
        receiverBankCountry,
        studentName,
        consultancy,
        ibrRate: parseFloat(ibrRate) || 0,
        amount: parseFloat(amount),
        currency: currency || "USD",
        totalAmount: parseFloat(totalAmount),
        customerRate: parseFloat(customerRate) || 0,
        status: status || "pending",
        createdBy: "system",
        quote: quote,
        calculations: calculations,
        generatedPDF: generatedPDF,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
