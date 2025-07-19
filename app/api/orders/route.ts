import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderId } from "@/lib/utils";
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
      createdBy,
      quote,
      calculations,
      generatedPDF,
      status,
      educationLoan,
      pancardNumber
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
    const validStatuses = [
      "Pending",
      "QuoteDownloaded",
      "Blocked",
      "SenderDetails",
      "BeneficiaryDetails",
      "DocumentsUploaded",
      "PaymentPending",
      "PaymentCompleted",
      "Completed",
      "Cancelled",
    ]

 if (status && !validStatuses.includes(status)) {
      return new NextResponse(`Invalid status: ${status}`, { status: 400 })
    }
    
    // Generate custom order id
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const countToday = await db.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });
    const customId = generateOrderId(countToday + 1, today);

    const order = await db.order.create({
      data: {
        id: customId,
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
        status:status || "Pending",
        createdBy: "system",
        quote: quote,
        calculations: calculations,
        generatedPDF: generatedPDF,
        educationLoan: educationLoan || "no" ,
        pancardNumber: pancardNumber || null,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
