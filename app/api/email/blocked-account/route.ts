import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { blockedAccountRegistrationTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, bank } = await request.json();

    if (!fullName || !email || !phone || !bank) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const html = blockedAccountRegistrationTemplate({ fullName, email, phone, bank });

    await sendEmail({
      to: "admin@buyexchange.in",
      cc: "forex@buyexchange.in",
      subject: "New Blocked Account Registration Request",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending blocked account registration email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
