import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { consultancyName, email, state, phone } = await request.json()

    if (!consultancyName || !email || !state || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Consultancy Registration</h2>
        <p>A new consultancy has registered with the following details:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Consultancy Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${consultancyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>State:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${state}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">Please follow up with this enquiry at your earliest convenience.</p>
      </div>
    `

    await sendEmail({
      to: "admin@buyexchange.in",
      cc: "forex@buyexchange.in",
      subject: `New Consultancy Registration - ${consultancyName}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
