import nodemailer from "nodemailer";

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    // Verify transporter configuration
    await transporter.verify();

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@buyexchange.com",
      to: email,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to Buyex Forex!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    // Verify transporter configuration
    await transporter.verify();

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@buyexchange.com",
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error);
    throw error;
  }
}
