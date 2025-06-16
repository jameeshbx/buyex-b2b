export const orderReceivedTemplate = ({
  orderDate,
  orderId,
  senderName,
  phone,
  email,
  purpose,
  receiverName,
  foreignCurrency,
  product,
  orderType,
  quantity,
  rate,
  tentativeAmount,
  forexConversionTax,
  bankFee,
  tcs,
  totalPayableAmount,
  residentStatus,
  motherName,
  relationshipWithReceiver,
  senderAddressLine1,
  senderAddressLine2,
  funding,
  senderAccountNo,
  ifsc,
  bankName,
  branchName,
  agent,
  supportEmail,
  supportPhone
}: {
  orderDate: string;
  orderId: string;
  senderName: string;
  phone: string;
  email: string;
  purpose: string;
  receiverName: string;
  foreignCurrency: string;
  product: string;
  orderType: string;
  quantity: string | number;
  rate: string | number;
  tentativeAmount: string | number;
  forexConversionTax: string | number;
  bankFee: string | number;
  tcs: string | number;
  totalPayableAmount: string | number;
  residentStatus: string;
  motherName: string;
  relationshipWithReceiver: string;
  senderAddressLine1: string;
  senderAddressLine2: string;
  funding: string;
  senderAccountNo: string;
  ifsc: string;
  bankName: string;
  branchName: string;
  agent: string;
  supportEmail: string;
  supportPhone: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Received - Send Money Abroad</title>
</head>
<body style="margin:0;padding:0;font-family: 'Inter', Arial, sans-serif;background:#f7f8fa;">
  <div style="background:linear-gradient(135deg,#1a1a2e 60%,#f7f8fa 100%);padding:0 0 40px 0;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:#1a1a2e;padding:32px 24px 24px 24px;text-align:center;">
        <img src="https://buyexchange.in/_next/image?url=%2Flogo.png&w=128&q=75" alt="Buy Exchange Logo" style="height:40px;margin-bottom:16px;" />
        <h2 style="color:#fff;margin:0 0 8px 0;font-size:22px;font-weight:700;">Order Received</h2>
        <div style="color:#fff;font-size:18px;font-weight:500;">SEND MONEY ABROAD</div>
        <div style="color:#b2b2b2;font-size:14px;margin-top:8px;">${orderDate} &nbsp; • &nbsp; <b>ID: #${orderId}</b></div>
      </div>
      <div style="padding:24px;">
        <div style="background:#f7f8fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a2e;">Order Details</h3>
          <table style="width:100%;font-size:14px;color:#222;">
            <tr><td style="padding:4px 0;width:40%;">Sender Name</td><td style="padding:4px 0;">${senderName}</td></tr>
            <tr><td style="padding:4px 0;">Phone</td><td style="padding:4px 0;">${phone}</td></tr>
            <tr><td style="padding:4px 0;">Email</td><td style="padding:4px 0;">${email}</td></tr>
            <tr><td style="padding:4px 0;">Purpose</td><td style="padding:4px 0;">${purpose}</td></tr>
            <tr><td style="padding:4px 0;">Receiver Name</td><td style="padding:4px 0;">${receiverName}</td></tr>
          </table>
        </div>
        <div style="background:#f7f8fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a2e;">Forex Order</h3>
          <table style="width:100%;font-size:14px;color:#222;">
            <tr><td style="padding:4px 0;width:40%;">Foreign Currency</td><td style="padding:4px 0;">${foreignCurrency}</td></tr>
            <tr><td style="padding:4px 0;">Product</td><td style="padding:4px 0;">${product}</td></tr>
            <tr><td style="padding:4px 0;">Order Type</td><td style="padding:4px 0;">${orderType}</td></tr>
            <tr><td style="padding:4px 0;">Quantity</td><td style="padding:4px 0;">${quantity}</td></tr>
            <tr><td style="padding:4px 0;">Rate</td><td style="padding:4px 0;">${rate}</td></tr>
            <tr><td style="padding:4px 0;">Tentative Amount</td><td style="padding:4px 0;">${tentativeAmount}</td></tr>
            <tr><td style="padding:4px 0;">Forex Conversion Tax</td><td style="padding:4px 0;">${forexConversionTax}</td></tr>
            <tr><td style="padding:4px 0;">Bank fee</td><td style="padding:4px 0;">${bankFee}</td></tr>
            <tr><td style="padding:4px 0;">TCS@5%</td><td style="padding:4px 0;">${tcs}</td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">Total Payable Amount</td><td style="padding:4px 0;font-weight:600;">₹ ${totalPayableAmount}</td></tr>
          </table>
          <div style="font-size:12px;color:#888;margin-top:8px;">*Please confirm the final payable amount if TCS is applicable.</div>
        </div>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="https://buyexchange.in/dashboard" style="display:inline-block;padding:12px 32px;background:#f72585;color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:16px;">Login to dashboard</a>
          <div style="font-size:12px;color:#888;margin-top:8px;">Kindly update the status on your Dashboard.</div>
        </div>
        <div style="background:#f7f8fa;border-radius:12px;padding:20px 16px;margin-bottom:24px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a2e;">Other Details</h3>
          <table style="width:100%;font-size:14px;color:#222;">
            <tr><td style="padding:4px 0;width:40%;">Resident status</td><td style="padding:4px 0;">${residentStatus}</td></tr>
            <tr><td style="padding:4px 0;">Mother's name</td><td style="padding:4px 0;">${motherName}</td></tr>
            <tr><td style="padding:4px 0;">Relationship with receiver</td><td style="padding:4px 0;">${relationshipWithReceiver}</td></tr>
            <tr><td style="padding:4px 0;">Sender address line 1</td><td style="padding:4px 0;">${senderAddressLine1}</td></tr>
            <tr><td style="padding:4px 0;">Sender address line 2</td><td style="padding:4px 0;">${senderAddressLine2}</td></tr>
            <tr><td style="padding:4px 0;">Funding</td><td style="padding:4px 0;">${funding}</td></tr>
            <tr><td style="padding:4px 0;">Sender account no.</td><td style="padding:4px 0;">${senderAccountNo}</td></tr>
            <tr><td style="padding:4px 0;">IFSC</td><td style="padding:4px 0;">${ifsc}</td></tr>
            <tr><td style="padding:4px 0;">Bank name</td><td style="padding:4px 0;">${bankName}</td></tr>
            <tr><td style="padding:4px 0;">Branch name</td><td style="padding:4px 0;">${branchName}</td></tr>
            <tr><td style="padding:4px 0;">Agent</td><td style="padding:4px 0;">${agent}</td></tr>
          </table>
        </div>
        <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:16px;">
          If you did not initiate this request, please disregard this message.<br/>
          For any concerns or to report unauthorized activity, kindly contact our support team immediately.<br/>
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

// Test block for the email template
if (require.main === module) {
  const html = orderReceivedTemplate({
    orderDate: 'April 28th, 2025',
    orderId: 'ORD038',
    senderName: 'NEETHHOL',
    phone: '7736654323',
    email: 'neethumolchandy234@gmail.com',
    purpose: 'University Fee Transfer',
    receiverName: 'Flywire Payments Corporation',
    foreignCurrency: 'GBP',
    product: 'Send Money Abroad',
    orderType: 'Buy',
    quantity: 2777.5,
    rate: 111.96,
    tentativeAmount: 310968.9,
    forexConversionTax: 469.87,
    bankFee: 1500,
    tcs: 0,
    totalPayableAmount: 312939,
    residentStatus: 'Resident',
    motherName: '',
    relationshipWithReceiver: 'Self',
    senderAddressLine1: 'KANJIRAKATTUKUNNEL,MARIYAPURAM PO,IDUKKI',
    senderAddressLine2: 'PIN:685602,KERALA,INDIA',
    funding: 'Self',
    senderAccountNo: '7736654323',
    ifsc: '',
    bankName: '',
    branchName: 'University Fee Transfer',
    agent: '#AGT002 - Sample agent',
    supportEmail: 'support@buyexchange.in',
    supportPhone: '+91 90722 43243',
  });
  // eslint-disable-next-line no-console
  console.log(html);
}
