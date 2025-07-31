import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Load the existing PDF template
    const formBytes = await fs.readFile('lib/A2Form-a2Form.pdf');
    const pdfDoc = await PDFDocument.load(formBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    
    const { height } = firstPage.getSize();

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
      date: new Date().toLocaleDateString(),
      name: "John Doe",
      dob: "1995-06-15",
      address: "123 Main Street, Apartment 4B, Downtown Area",
      address2: "Downtown Area, Mumbai, Maharashtra, India",
      state: "Maharashtra",
      postalCode: "400001",
      mobile: "+91-9876543210",
      email: "john.doe@example.com",
      nationality: "Indian",
      pan: "ABCDE1234F",
      resStatus: "ACTIVE",
      senderName: "John Doe",
      senderPassportNo: "1234567890",
      senderPAN: "ABCDE1234F",
      relation: "Self",
      forexAmountUSD: "5000 USD",
      forexAmountINR: "375000 INR",
      country: "United States",
      source: "Personal Savings",
      beneficiaryName: "University of California",
      beneficiaryAddress: "123 University Drive, Berkeley, CA 94720",
      bankAccount: "1234567890",
      bankName: "Bank of America",
      bankAddress: "123 Financial District, San Francisco, CA 94104, United States",
      swiftCode: "BOFAUS3N",
      abaCode: "026009593",
      reference: "Student ID: 12345, Semester: Fall 2024",
      additionalInfo: "Additional information",
      id: "test-order-123",
      purpose: "University Fee Transfer Test",
      foreignBankCharges: 25.50,
      payer: "Student",
      forexPartner: "Test Partner",
      margin: 0.5,
      receiverBankCountry: "United States",
      studentName: "John Doe",
      consultancy: "Test Consultancy",
      ibrRate: 0.05,
      amount: 5000,
      currency: "USD",
      totalAmount: 375000,
      customerRate: 75.0,
      educationLoan: "No",
      status: "PENDING",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      pancardNumber: "ABCDE1234F",
      sender: {
        id: "sender-123",
        studentName: "John Doe",
        studentEmailOriginal: "john.doe@example.com",
        studentEmailFake: "john.doe.fake@example.com",
        phoneNumber: "+91-9876543210",
        addressLine1: "123 Main Street, Apartment 4B, Downtown Area",
        addressLine2: "Downtown Area, Mumbai, Maharashtra, India",
        state: "Maharashtra",
        postalCode: "400001",
        nationality: "Indian",
        relationship: "Self",
        senderName: "John Doe",
        bankCharges: "25.50",
        pancardNumber: "ABCDE1234F",
        dob: "1995-06-15",
        senderNationality: "Indian",
        senderEmail: "john.doe@example.com",
        sourceOfFunds: "Personal Savings",
        occupationStatus: "Student",
        senderAddressLine1: "123 Main Street, Apartment 4B",
        senderAddressLine2: "Downtown Area",
        senderState: "Maharashtra",
        senderPostalCode: "400001",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      beneficiary: {
        id: "beneficiary-123",
        receiverFullName: "University of California",
        receiverCountry: "United States",
        address: "123 University Drive, Berkeley, CA 94720",
        receiverBank: "Bank of America",
        receiverBankAddress: "123 Financial District, San Francisco, CA 94104, United States",
        receiverBankCountry: "United States",
        receiverAccount: "1234567890",
        receiverBankSwiftCode: "BOFAUS3N",
        iban: "",
        sortCode: "",
        transitNumber: "",
        bsbCode: "",
        routingNumber: "026009593",
        anyIntermediaryBank: "No",
        intermediaryBankName: "",
        intermediaryBankAccountNo: "",
        intermediaryBankIBAN: "",
        intermediaryBankSwiftCode: "",
        totalRemittance: "5000 USD",
        field70: "Student ID: 12345, Semester: Fall 2024jsdshdsjkdsdjksdnsdskjdsadskjdasjhsdsjkdsbdjhsdbsjkd",
        status: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      }
    };

    // Add text to first page
    drawText(data.date, 60, height - 75);
  drawText(data.purpose, 340, height - 190);
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
    drawText(data.bankName, 220, height - 395, 10, secondPage);
    drawText(data.bankAddress, 320, height - 395, 8, secondPage);
    drawText(data.swiftCode, 150, height - 430, 10, secondPage);
    drawText(data.abaCode, 250, height - 455, 10, secondPage);
   
    const maxLineLength = 70;
    const line1 = data.beneficiary.field70.slice(0, maxLineLength);
    const line2 = data.beneficiary.field70.slice(maxLineLength);

    drawText(line1, 280, height - 516, 8, secondPage);
    if (line2) {
      drawText(line2, 280, height - 540, 8, secondPage); // 15 units lower for the second line
    }
  }


    // Serialize
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="A2Form.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

export async function GET() {
  // Redirect to POST or return a simple message
  return NextResponse.json({ 
    message: 'Please use POST method to generate A2 form',
    example: 'curl -X POST /api/generate-a2-form'
  });
} 