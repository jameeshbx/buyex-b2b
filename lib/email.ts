import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, cc, subject, html }: EmailOptions) {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send the email
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    cc,
    subject,
    html,
  });
}