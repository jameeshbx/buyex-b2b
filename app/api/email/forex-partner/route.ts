import { NextRequest, NextResponse } from "next/server";
import { sendEmailToForexPartner } from "@/lib/email-forex";

export async function POST(request: NextRequest) {
  try {
    const { documents } = await request.json();
    
    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Documents array is required" },
        { status: 400 }
      );
    }

    await sendEmailToForexPartner(documents);
    
    return NextResponse.json(
      { message: "Email sent successfully to forex partner" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email to forex partner:", error);
    return NextResponse.json(
      { error: "Failed to send email to forex partner" },
      { status: 500 }
    );
  }
} 