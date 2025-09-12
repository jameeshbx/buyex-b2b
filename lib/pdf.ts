import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
interface Order {
  id: string;
  purpose: string;
  foreignBankCharges: number;
  payer: string;
  forexPartner: string;
  margin: number;
  receiverBankCountry: string;
  studentName: string;
  consultancy: string;
  ibrRate: number;
  amount: number;
  currency: string;
  totalAmount: number;
  customerRate: number;
  educationLoan?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pancardNumber: string;
  sender?: {
    id: string;
    studentName: string;
    studentEmailOriginal: string;
    studentEmailFake: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    postalCode: string;
    nationality: string;
    relationship: string;
    senderName: string;
    bankCharges: string;
    pancardNumber: string;
    dob: string;
    senderNationality: string;
    senderEmail: string;
    sourceOfFunds: string;
    occupationStatus: string;
    senderAddressLine1: string;
    senderAddressLine2: string;
    senderState: string;
    senderPostalCode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  beneficiary?: {
    id: string;
    receiverFullName: string;
    receiverCountry: string;
    address: string;
    receiverBank: string;
    receiverBankAddress: string;
    receiverBankCountry: string;
    receiverAccount: string;
    receiverBankSwiftCode: string;
    iban: string;
    sortCode: string;
    transitNumber: string;
    bsbCode: string;
    routingNumber: string;
    anyIntermediaryBank: string;
    intermediaryBankName: string;
    intermediaryBankAccountNo: string;
    intermediaryBankIBAN: string;
    intermediaryBankSwiftCode: string;
    totalRemittance: string;
    field70: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Remove or replace problematic Unicode characters
  return text
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[^\w\s\-.,()&@#$%]/g, '') // Keep only safe characters
    .trim();
};

// Helper function to split address if longer than 100 characters
const splitAddress = (address: string, maxLength: number = 150): string[] => {
  if (!address || address.length <= maxLength) {
    return [address];
  }
  
  // Try to split at word boundaries
  const words = address.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLength) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
};

export async function generateA2Form(order: Order) {
  // Fetch the PDF template from the public directory
  const formResponse = await fetch('/A2Form-a2Form .pdf');
  const formBytes = await formResponse.arrayBuffer();
  const pdfDoc = await PDFDocument.load(formBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const secondPage = pages[1]; // Get the second page
  
  const { width, height } = firstPage.getSize();

  console.log(width, height);

  // Load font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text: string, x: number, y: number, size = 10, page = firstPage) => {
    const sanitizedText = sanitizeText(text);
    if (!sanitizedText) return; // Skip empty text
    page.drawText(sanitizedText, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Get the appropriate address based on payer type
  const addressToUse = order.payer === 'Self' 
    ?  order.sender?.addressLine1 || ''
    : order.sender?.senderAddressLine1 || '';

  const addressLines = splitAddress(addressToUse);
  
  const data = {
    date: new Date(order.createdAt).toLocaleDateString(),
    name: order.payer === 'Self' ? order.sender?.studentName || '' : order.sender?.senderName || '',
    dob: order.sender?.dob || '',
    address: addressLines[0] || '',
    address2: order.payer === 'Self' 
      ? (addressLines[1] || '') + (order.sender?.addressLine2 ? ' ' + order.sender.addressLine2 : '')
      : order.sender?.senderAddressLine2 || '',
    state: order.sender?.state || '',
    postalCode: order.sender?.postalCode || '',
    mobile: order.sender?.phoneNumber || '',
    email: order.sender?.studentEmailFake || '',
    nationality: order.sender?.nationality || '',
    pan: order.sender?.pancardNumber || '',
    resStatus: 'Resident',

    senderName: order.payer === 'Self' ? order.sender?.studentName || '' : order.sender?.senderName || '',
    senderPassportNo: '',
    senderPAN: order.pancardNumber || '',
    relation: order.sender?.relationship || '',

    forexPurpose: order.purpose || '',
    forexAmountUSD: order.amount.toString() + ' ' + order.currency,
    forexAmountINR: order.totalAmount.toString(),
    country: order.receiverBankCountry || '',
    source: order.sender?.sourceOfFunds || '',
    beneficiaryName: order.beneficiary?.receiverFullName || '',
    beneficiaryAddress: order.beneficiary?.address || '',
    bankAccount: order.beneficiary?.receiverAccount || '',
    bankName: order.beneficiary?.receiverBank || '',
    bankAddress: order.beneficiary?.receiverBankAddress || '',
    swiftCode: order.beneficiary?.receiverBankSwiftCode || '',
    abaCode: order.beneficiary?.sortCode || order.beneficiary?.transitNumber || order.beneficiary?.bsbCode || order.beneficiary?.routingNumber || '',
    reference:  '',
    additionalInfo: order.beneficiary?.field70 || '',
  };

  // Add text to first page (coordinates are approximate; adjust as per actual form layout)
  drawText(data.date, 60, height - 75);
  drawText(data.forexPurpose, 350, height - 190);
  drawText(data.name, 120, height - 275);
  drawText(data.dob, 430, height - 275);  
  drawText(data.address, 100, height - 305, 8);
  
  // Draw additional address lines if address was split
  // if (addressLines.length > 1) {
  //   drawText(addressLines[1], 100, height - 325);
  // }
  
  drawText(data.address2, 50, height - 330, 8);
  drawText(data.state, 50, height - 350);
  drawText(data.postalCode, 470, height - 330);
  drawText(data.mobile, 470, height - 360);  
  drawText(data.email, 100, height - 380);
  drawText(data.nationality, 410, height - 380);
  drawText(data.pan, 100, height - 410);
  drawText(data.resStatus, 470, height - 410);
  drawText(data.senderName, 140, height - 500);
  drawText(data.senderPassportNo, 430, height - 500);
  drawText(data.senderPAN, 100, height - 535);
  drawText(data.relation, 280, height - 590);
  

  // Add text to second page
  if (secondPage) {
    drawText(data.forexAmountUSD, 150, height - 120, 10, secondPage);
    // drawText(data.forexAmountUSD, 450, height - 150, 10, secondPage);
    drawText(data.forexAmountINR, 150, height - 150, 10, secondPage);
    drawText(data.country, 200, height - 175, 10, secondPage);
    drawText(data.source, 200, height - 200, 10, secondPage);
    drawText(data.beneficiaryName, 200, height - 320, 10, secondPage);
    drawText(data.beneficiaryAddress, 200, height - 345, 8, secondPage);
    drawText(data.bankAccount, 200, height - 370, 10, secondPage);
    drawText(data.bankName, 200, height - 394, 8, secondPage);
    drawText(data.bankAddress, 200, height - 404, 8, secondPage);
    drawText(data.swiftCode, 150, height - 430, 10, secondPage);
    drawText(data.abaCode, 250, height - 455, 10, secondPage);
    drawText(data.reference, 280, height - 510, 10, secondPage);
    const maxLineLength = 70; // or any suitable length for your layout
    const line1 = data.additionalInfo.slice(0, maxLineLength);
    const line2 = data.additionalInfo.slice(maxLineLength);

    drawText(line1, 280, height - 516, 8, secondPage);
    if (line2) {
      drawText(line2, 280, height - 550, 8, secondPage); // 15 units lower for the second line
    }
  }

  // Serialize and return
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
