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
    mothersName: string;
    dob: string;
    senderNationality: string;
    senderEmail: string;
    sourceOfFunds: string;
    occupationStatus: string;
    payerAccountNumber: string;
    payerBankName: string;
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
export async function generateA2Form(order: Order) {
  // Fetch the PDF template from the public directory
  const formResponse = await fetch('/A2Form-a2Form.pdf');
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
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Sample data to be filled
  const data = {
    date: order.createdAt,
    name: order.sender?.studentName || '',
    dob: order.sender?.dob || '',
    address: order.sender?.addressLine1 || '',
    mobile: order.sender?.phoneNumber || '',
    email: order.sender?.studentEmailOriginal || '',
    nationality: order.sender?.nationality || '',
    pan: '',
    resStatus: 'Resident',

    senderName: order.sender?.senderName || '',
    senderPassportNo: '',
    senderPAN: '',
    relation: order.sender?.relationship || '',

    forexPurpose: order.purpose || '',
    forexAmountUSD: order.totalAmount.toString(),
    forexAmountINR: order.totalAmount.toString(),
    country: order.receiverBankCountry || '',
    source: order.sender?.sourceOfFunds || '',
    beneficiaryName: order.beneficiary?.receiverFullName || '',
    beneficiaryAddress: order.beneficiary?.address || '',
    bankAccount: order.beneficiary?.receiverAccount || '',
    bankName: order.beneficiary?.receiverBank || '',
    bankAddress: order.beneficiary?.receiverBankAddress || '',
    swiftCode: order.beneficiary?.receiverBankSwiftCode || '',
    abaCode: order.beneficiary?.receiverBankSwiftCode || '',
    reference: order.sender?.payerAccountNumber || '',
  };

  // Add text to first page (coordinates are approximate; adjust as per actual form layout)
  drawText(data.date, 60, height - 75);
  drawText(data.name, 120, height - 275);
  drawText(data.dob, 430, height - 275);  
  drawText(data.address, 100, height - 305);
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
    drawText(data.forexAmountUSD, 450, height - 150, 10, secondPage);
    drawText(data.forexAmountINR, 150, height - 150, 10, secondPage);
    drawText(data.country, 200, height - 175, 10, secondPage);
    drawText(data.source, 200, height - 200, 10, secondPage);
    drawText(data.beneficiaryName, 200, height - 320, 10, secondPage);
    drawText(data.beneficiaryAddress, 200, height - 345, 10, secondPage);
    drawText(data.bankAccount, 200, height - 370, 10, secondPage);
    drawText(data.bankName, 250, height - 395, 10, secondPage);
    drawText(data.bankAddress, 350, height - 395, 10, secondPage);
    drawText(data.swiftCode, 150, height - 430, 10, secondPage);
    drawText(data.abaCode, 250, height - 455, 10, secondPage);
    drawText(data.reference, 280, height - 510, 10, secondPage);
  }

  // Serialize and return
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
