import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/orders/[id] - Get a specific order
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update a specific order
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    } = body;

    const { id } = await params;

    const order = await db.order.update({
      where: {
        id,
      },
      data: {
        purpose,
        foreignBankCharges: foreignBankCharges
          ? parseFloat(foreignBankCharges)
          : undefined,
        payer,
        forexPartner,
        margin: margin ? parseFloat(margin) : undefined,
        receiverBankCountry,
        studentName,
        consultancy,
        ibrRate: ibrRate ? parseFloat(ibrRate) : undefined,
        amount: amount ? parseFloat(amount) : undefined,
        currency,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        customerRate: customerRate ? parseFloat(customerRate) : undefined,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete a specific order
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await db.order.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
