import { NextResponse } from "next/server";
import { db } from "@/lib/db";
 // Add this import if you have Prisma types

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
    const { id } = await params;

    // Build updateData by only including defined fields
    const updateData = Object.fromEntries(
      Object.entries({
        purpose: body.purpose,
        foreignBankCharges: body.foreignBankCharges !== undefined ? parseFloat(body.foreignBankCharges) : undefined,
        payer: body.payer,
        forexPartner: body.forexPartner,
        margin: body.margin !== undefined ? parseFloat(body.margin) : undefined,
        receiverBankCountry: body.receiverBankCountry,
        studentName: body.studentName,
        consultancy: body.consultancy,
        ibrRate: body.ibrRate !== undefined ? parseFloat(body.ibrRate) : undefined,
        status: body.status,
        amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
        currency: body.currency,
        totalAmount: body.totalAmount !== undefined ? parseFloat(body.totalAmount) : undefined,
        customerRate: body.customerRate !== undefined ? parseFloat(body.customerRate) : undefined,
        senderId: body.senderId,
        beneficiaryId: body.beneficiaryId,
      }).filter(([, v]) => v !== undefined && v !== null)
    );

    const order = await db.order.update({
      where: {
        id,
      },
      data: updateData,
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
