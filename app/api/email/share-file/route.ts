import { NextRequest, NextResponse } from "next/server";
import { sendEmailWithAttachment } from "@/lib/email";

// Email template for sharing files with students
const createFileShareEmailTemplate = ({
  studentName,
  fileName,
  fileComment,
  uploadedBy,
  uploadedAt,
  supportEmail,
  supportPhone,
}: {
  studentName: string;
  fileName: string;
  fileComment: string;
  uploadedBy: string;
  uploadedAt: string;
  supportEmail: string;
  supportPhone: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Shared - Buy Exchange</title>
</head>
<body style="margin:0;padding:0;font-family: 'Inter', Arial, sans-serif;background:#f7f8fa;">
  <div style="background:linear-gradient(135deg,#1a1a2e 60%,#f7f8fa 100%);padding:0 0 40px 0;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:#1a1a2e;padding:32px 24px 24px 24px;text-align:center;">
        <img src="https://buyexchange.in/_next/image?url=%2Flogo.png&w=128&q=75" alt="Buy Exchange Logo" style="height:40px;margin-bottom:16px;" />
        <h2 style="color:#fff;margin:0 0 8px 0;font-size:22px;font-weight:700;">File Shared</h2>
        <div style="color:#fff;font-size:18px;font-weight:500;">DOCUMENT UPLOAD</div>
        <div style="color:#b2b2b2;font-size:14px;margin-top:8px;">${uploadedAt}</div>
      </div>
      <div style="padding:24px;">
        <div style="color:#222;font-size:14px;margin-bottom:16px;">
          Hello ${studentName},<br/>
          A file has been shared with you by our staff team. Please find the details below:
        </div>
        
        <div style="background:#f7f8fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a2e;">File Details</h3>
          <table style="width:100%;font-size:14px;color:#222;">
            <tr><td style="padding:4px 0;width:40%;">File Name</td><td style="padding:4px 0;">${fileName}</td></tr>
            <tr><td style="padding:4px 0;">Comment</td><td style="padding:4px 0;">${fileComment || 'No comment provided'}</td></tr>
            <tr><td style="padding:4px 0;">Uploaded By</td><td style="padding:4px 0;">${uploadedBy}</td></tr>
            <tr><td style="padding:4px 0;">Uploaded At</td><td style="padding:4px 0;">${uploadedAt}</td></tr>
          </table>
        </div>

        <div style="background:#e8f4fd;border-radius:12px;padding:20px 16px;margin-bottom:24px;border-left:4px solid #1a1a2e;">
          <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1a1a2e;">📎 File Attachment</h4>
          <p style="margin:0;font-size:13px;color:#666;">
            The file "${fileName}" is attached to this email. Please download and review the document.
          </p>
        </div>

        <div style="text-align:center;margin-bottom:24px;">
          <a href="https://buyexchange.in/dashboard" style="display:inline-block;padding:12px 32px;background:#f72585;color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:16px;">Login to Dashboard</a>
          <div style="font-size:12px;color:#888;margin-top:8px;">Access your account to view all shared files and documents.</div>
        </div>

        <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:16px;">
          If you did not expect this file, please contact our support team immediately.<br/>
          <b>Email :</b> <a href="mailto:${supportEmail}" style="color:#f72585;text-decoration:none;">${supportEmail}</a> &nbsp; | &nbsp; <b>Phone :</b> <a href="tel:${supportPhone}" style="color:#f72585;text-decoration:none;">${supportPhone}</a>
        </div>
        
        <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:24px;">
          Our support team is available to assist you with any queries or clarifications you may need.<br/>
          Thank you for choosing Buy Exchange.<br/>
          <span style="color:#888;">— Team Buy Exchange</span>
        </div>
      </div>
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <img src="https://buyexchange.in/_next/image?url=%2Flogo.png&w=128&q=75" alt="Buy Exchange Logo" style="height:32px;margin-bottom:8px;" />
        <div style="color:#fff;font-size:13px;margin-bottom:8px;">
          <span style="margin-right:12px;">#startupindia</span>
          <span style="margin-right:12px;">Kerala Startup Mission</span>
          <span>10,000 Startups</span>
        </div>
        <div style="color:#b2b2b2;font-size:12px;margin-bottom:8px;">
          <a href="https://buyexchange.in/services" style="color:#b2b2b2;text-decoration:none;margin-right:16px;">BuyEx Services</a>
          <a href="https://buyexchange.in/privacy-policy" style="color:#b2b2b2;text-decoration:none;">Privacy Policy</a>
        </div>
        <div style="color:#b2b2b2;font-size:12px;">
          Buy Exchange Fintech.<br/>
          First Floor, Integrated Startup Complex,<br/>
          Kerala Technology Innovation Zone HMT Colony, Kalamassery - Kochi, Kerala-683503
        </div>
        <div style="color:#b2b2b2;font-size:11px;margin-top:8px;">
          This email was sent to you regarding your BuyEx account.<br/>
          <a href="https://buyexchange.in" style="color:#b2b2b2;text-decoration:none;">buyexchange.in</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const studentEmail = formData.get('studentEmail') as string;
    const studentName = formData.get('studentName') as string;
    const fileName = formData.get('fileName') as string;
    const fileComment = formData.get('fileComment') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const uploadedAt = formData.get('uploadedAt') as string;
    const file = formData.get('file') as File;

    if (!studentEmail || !fileName || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: studentEmail, fileName, and file are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer for attachment
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Generate email HTML
    const emailHtml = createFileShareEmailTemplate({
      studentName: studentName || 'Student',
      fileName,
      fileComment: fileComment || '',
      uploadedBy: uploadedBy || 'Staff Member',
      uploadedAt: uploadedAt || new Date().toLocaleString(),
      supportEmail: process.env.SUPPORT_EMAIL || 'support@buyexchange.in',
      supportPhone: process.env.SUPPORT_PHONE || '+91 90722 43243',
    });

    // Send email with attachment
    await sendEmailWithAttachment({
      to: studentEmail,
      subject: `File Shared: ${fileName} - Buy Exchange`,
      html: emailHtml,
      attachments: [{
        filename: fileName,
        content: fileBuffer,
        contentType: file.type,
      }],
    });

    return NextResponse.json({
      success: true,
      message: `File "${fileName}" has been shared with ${studentEmail} successfully`
    });

  } catch (error) {
    console.error('Share file email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email with file attachment' },
      { status: 500 }
    );
  }
} 