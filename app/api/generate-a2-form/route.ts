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
      date: '30-06-2025',
      name: 'MUHAMMED GIFRIN',
      dob: '17-06-2003',
      address: 'KOTHAYIL HOUSE, VENGALLUR P O, THODUPUZHA, IDUKKI, KERALA, INDIA - 685608',
      mobile: '9532410074',
      email: 'muhammedgifrin0011@gmail.com',
      nationality: 'Indian',
      pan: 'EXEPG9653L',
      resStatus: 'resident',

      senderName: 'Jameesh',
      senderPassportNo: 'A91PX132',
      senderPAN: 'EXEPG9653L',
      relation: 'Brother',

      forexPurpose: 'University Fee Transfer',
      forexAmountUSD: 'USD 1408',
      forexAmountINR: 'Rs 122805.76',
      country: 'United States of America',
      source: 'Personal Savings',
      beneficiaryName: 'Flywire Payments Corporation',
      beneficiaryAddress: '141 Tremont Street, 10th Floor, Boston, MA 02111',
      bankAccount: '30993074',
      bankName: 'CITIBANK NA',
      bankAddress: '111 Wall Street, New York, NY 10043, USA',
      swiftCode: 'CITIUS33',
      abaCode: '021000089',
      reference: 'PMH286577040, MUHAMMED GIFRIN, Applicant ID: 2541181',
    };

    // Add text to first page
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