import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}

interface EmailWithAttachmentOptions extends EmailOptions {
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

const createResetPasswordEmail = (resetUrl: string, userName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-width: 150px; }
        .button { 
            display: inline-block;
            padding: 12px 24px;
            background-color: #1a365d;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
        }
        .footer { 
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${
              process.env.NEXT_PUBLIC_APP_URL
            }/buyex-main-logo.png" alt="Buy Exchange Logo" class="logo">
        </div>
        <h2>Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password for your Buy Exchange account. Click the button below to reset your password:</p>
        <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Buy Exchange. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendEmail({ to, cc, subject, html }: EmailOptions) {
  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Send the email
    const info = await transporter.sendMail({
      from: `"Buy Exchange" <${process.env.SMTP_FROM}>`,
      to,
      cc,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendEmailWithAttachment({ 
  to, 
  cc, 
  subject, 
  html, 
  attachments 
}: EmailWithAttachmentOptions) {
  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Send the email with attachments
    const info = await transporter.sendMail({
      from: `"Buy Exchange" <${process.env.SMTP_FROM}>`,
      to,
      cc,
      subject,
      html,
      attachments,
    });

    console.log("Email with attachment sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email with attachment:", error);
    throw new Error("Failed to send email with attachment");
  }
}

export { createResetPasswordEmail };
