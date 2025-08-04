import {  NextResponse } from "next/server";
import { sendEmailToForexPartner } from "@/lib/email-forex";


export async function POST(request: Request) {
  try {
    const { order, to, documents } = await request.json();
    
    // Call the updated function with order object
    await sendEmailToForexPartner(order, documents, to);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in forex partner email route:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 