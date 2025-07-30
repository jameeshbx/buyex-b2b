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
  rate,
  tentativeAmount,
  forexConversionTax,
  bankFee,
  tcs,
  totalPayableAmount,
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
  rate: string | number;
  tentativeAmount: string | number;
  forexConversionTax: string | number;
  bankFee: string | number;
  tcs: string | number;
  totalPayableAmount: string | number;
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
            <tr><td style="padding:4px 0;">Rate</td><td style="padding:4px 0;">${rate}</td></tr>
            <tr><td style="padding:4px 0;">FCY Amount</td><td style="padding:4px 0;">${tentativeAmount}</td></tr>
            <tr><td style="padding:4px 0;">Forex Conversion Tax</td><td style="padding:4px 0;">${forexConversionTax}</td></tr>
            <tr><td style="padding:4px 0;">Bank fee</td><td style="padding:4px 0;">${bankFee}</td></tr>
            <tr><td style="padding:4px 0;">TCS@5%</td><td style="padding:4px 0;">${tcs}</td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">Total Payable Amount</td><td style="padding:4px 0;font-weight:600;">₹ ${totalPayableAmount}</td></tr>
          </table>
          <div style="font-size:12px;color:#888;margin-top:8px;">*Please confirm the final payable amount if TCS is applicable.</div>
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

export const swiftCopyTemplate = ({
  orderDate,
  orderId,
  senderName,
  phone,
  email,
  purpose,
  receiverName,
  downloadLink,
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
  downloadLink: string;
  supportEmail: string;
  supportPhone: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SWIFT Copy - Buy Exchange</title>
</head>
<body style="margin:0;padding:0;font-family: 'Inter', Arial, sans-serif;background:#f7f8fa;">
  <div style="background:#fff;max-width:700px;margin:40px auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#18183a;padding:40px 0 32px 0;text-align:center;">
      
      <h2 style="color:#fff;margin:0 0 8px 0;font-size:28px;font-weight:700;letter-spacing:1px;">SWIFT COPY</h2>
      <div style="color:#fff;font-size:16px;font-weight:400;">${orderDate} &nbsp; • &nbsp; <b>ID : #${orderId}</b></div>
    </div>
    <div style="padding:32px 32px 0 32px;">
      <div style="color:#222;font-size:14px;margin-bottom:16px;">Hi ${senderName},<br/>please find below the the link to download your swift copy.</div>
      <div style="background:#18183a;border-radius:12px 12px 0 0;padding:16px 24px;">
        <h3 style="margin:0 0 12px 0;font-size:17px;font-weight:600;color:#fff;">Order Details</h3>
      </div>
      <div style="background:#f7f8fa;border-radius:0 0 12px 12px;padding:20px 24px 16px 24px;margin-bottom:32px;">
        <table style="width:100%;font-size:14px;color:#222;">
          <tr><td style="padding:4px 0;width:40%;">Sender Name</td><td style="padding:4px 0;">${senderName}</td></tr>
          <tr><td style="padding:4px 0;">Phone</td><td style="padding:4px 0;">${phone}</td></tr>
          <tr><td style="padding:4px 0;">Email</td><td style="padding:4px 0;">${email}</td></tr>
          <tr><td style="padding:4px 0;">Purpose</td><td style="padding:4px 0;">${purpose}</td></tr>
          <tr><td style="padding:4px 0;">Receiver Name</td><td style="padding:4px 0;">${receiverName}</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${downloadLink}" style="display:inline-block;padding:14px 36px;background:#f72585;color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:16px;box-shadow:0 2px 8px rgba(247,37,133,0.08);margin-bottom:8px;">
          <span style="font-size:18px;vertical-align:middle;">⚡</span> Download here
        </a>
      </div>
      <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:16px;font-weight:600;">
        If you did not request, please disregard this message.
      </div>
      <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:16px;">
        For any concerns or to report unauthorized activity, kindly contact our support team immediately.<br/>
        <b>Email :</b> <a href="mailto:${supportEmail}" style="color:#f72585;text-decoration:none;">${supportEmail}</a> &nbsp; | &nbsp; <b>Phone :</b> <a href="tel:${supportPhone}" style="color:#f72585;text-decoration:none;">${supportPhone}</a>
      </div>
      <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:24px;">
        Our support team is available to assist you with any queries or clarifications you may need.<br/>
        Thank you for choosing Buy Exchange.<br/>
        <span style="color:#888;">— Team Buy Exchange</span>
      </div>
    </div>
    <div style="background:#18183a;padding:24px;text-align:center;">
      <div style="color:#fff;font-size:15px;margin-bottom:8px;">
        <span style="margin-right:12px;">#startupindia</span>
        <span style="margin-right:12px;">Kerala Startup Mission</span>
        <span>10,000 Startups</span>
      </div>
      <div style="color:#b2b2b2;font-size:12px;margin-bottom:8px;">
        Buy Exchange Fintech.<br/>
        First Floor, Integrated Startup Complex,<br/>
        Kerala Technology Innovation Zone HMT Colony, Kalamassery - Kochi, Kerala-683503
      </div>
      <div style="color:#b2b2b2;font-size:11px;margin-top:8px;">
        This email was sent to you regarding your BuyEx account.<br/>
        <a href="https://buyexchange.in" style="color:#b2b2b2;text-decoration:none;">buyexchange.in</a>
      </div>
      <div style="margin-top:12px;">
        <a href="https://facebook.com/buyexchange" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" style="height:20px;width:20px;filter:invert(1);" /></a>
        <a href="https://instagram.com/buyexchange" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style="height:20px;width:20px;filter:invert(1);" /></a>
        <a href="https://youtube.com/@buyexchange" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" style="height:20px;width:20px;filter:invert(1);" /></a>
        <a href="https://tiktok.com/@buyexchange" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style="height:20px;width:20px;filter:invert(1);" /></a>
        <a href="https://linkedin.com/company/buyexchange" style="margin:0 6px;display:inline-block;"><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" style="height:20px;width:20px;filter:invert(1);" /></a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const forexPartnerTemplate = ({
  orderDate,
  orderId,
  senderName,
  phone,
  email,
  purpose,
  receiverName,
  foreignCurrency,
  product,
  rate,
  tentativeAmount,
  totalPayableAmount,
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
  rate: string | number;
  tentativeAmount: string | number;
  totalPayableAmount: string | number;
  supportEmail: string;
  supportPhone: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Buy Exchange</title>
</head>
<body style="margin:0;padding:0;font-family: 'Inter', Arial, sans-serif;background:#f7f8fa;">
  <div style="background:linear-gradient(135deg,#1a1a2e 60%,#f7f8fa 100%);padding:0 0 40px 0;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:#1a1a2e;padding:32px 24px 24px 24px;text-align:center;">
        <h2 style="color:#fff;margin:0 0 8px 0;font-size:22px;font-weight:700;">New Order</h2>
        <div style="color:#fff;font-size:18px;font-weight:500;">FOREX PARTNER</div>
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
            <tr><td style="padding:4px 0;">Rate</td><td style="padding:4px 0;">${rate}</td></tr>
            <tr><td style="padding:4px 0;">FCY Amount</td><td style="padding:4px 0;">${tentativeAmount}</td></tr>
            <tr><td style="padding:4px 0;font-weight:600;">Total Payable Amount</td><td style="padding:4px 0;font-weight:600;">₹ ${totalPayableAmount}</td></tr>
          </table>
        </div>
        <div style="background:#e8f4fd;border-radius:12px;padding:20px 16px;margin-bottom:24px;border-left:4px solid #1a1a2e;">
          <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;color:#1a1a2e;"> Attached Documents</h3>
          <p style="margin:0;font-size:14px;color:#222;">Please find the required documents attached in the zip file for processing this order.</p>
        </div>
        <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:16px;">
          For any queries regarding this order, please contact our support team.<br/>
          <b>Email :</b> <a href="mailto:${supportEmail}" style="color:#f72585;text-decoration:none;">${supportEmail}</a> &nbsp; | &nbsp; <b>Phone :</b> <a href="tel:${supportPhone}" style="color:#f72585;text-decoration:none;">${supportPhone}</a>
        </div>
        <div style="font-size:13px;color:#1a1a2e;text-align:center;margin-bottom:24px;">
          Thank you for your partnership with Buy Exchange.<br/>
          <span style="color:#888;">— Team Buy Exchange</span>
        </div>
      </div>
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
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
          This email was sent to you regarding your BuyEx partnership.<br/>
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
    rate: 111.96,
    tentativeAmount: 310968.9,
    forexConversionTax: 469.87,
    bankFee: 1500,
    tcs: 0,
    totalPayableAmount: 312939,
    supportEmail: 'support@buyexchange.in',
    supportPhone: '+91 90722 43243',
  });
  // eslint-disable-next-line no-console
  console.log(html);
}


