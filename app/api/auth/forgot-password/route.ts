import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// Create a transporter for sending emails

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists, you will receive a password reset email.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { user: { id: user.id } },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        user: { connect: { id: user.id } },
        token,
        expires,
      },
    });

    // Send reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json(
      {
        message:
          "If an account exists, you will receive a password reset email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}