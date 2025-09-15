import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail, createResetPasswordEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Create a transporter for sending emails

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await rateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Always return success to prevent email enumeration
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
      to: user.email,
      subject: "Reset Your Buyex Forex Password",
      html: createResetPasswordEmail(resetUrl, user.name || "there"),
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
