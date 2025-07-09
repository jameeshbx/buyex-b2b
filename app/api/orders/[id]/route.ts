import { NextResponse } from "next/server";
import { db } from "@/lib/db";
 // Add this import if you have Prisma types

// Helper function to retry database operations
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      // if (error.code === 'P1001' && i < maxRetries - 1) {
      //   // Wait before retrying (exponential backoff)
      //   await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      //   continue;
      // }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// GET /api/orders/[id] - Get a specific order
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await retryOperation(async () => {
      return await db.order.findUnique({
        where: {
          id,
        },
        include: {
          sender: true,
          beneficiary: true,
        },
      });
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    
    // if (error.code === 'P1001') {
    //   return new NextResponse("Database connection error. Please try again later.", { status: 503 });
    // }
    
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
        educationLoan: body.educationLoan
      }).filter(([, v]) => v !== undefined && v !== null)
    );

    // Convert status to proper case if it's 'blocked'
    if (updateData.status === 'blocked') {
      updateData.status = 'Blocked';
    }
    

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
