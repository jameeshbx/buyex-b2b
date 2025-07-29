import { generateA2Form } from './lib/pdf';
import fs from 'fs/promises';

// Dummy data for testing the generateA2Form function
const dummyOrder = {
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
    field70: "Student ID: 12345, Semester: Fall 2024",
    status: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  }
};

async function testGenerateA2Form() {
  try {
    console.log('Testing generateA2Form function...');
    
    // Generate the PDF
    const pdfBytes = await generateA2Form(dummyOrder);
    
    // Save the generated PDF to a file
    const outputPath = './test-a2-form-output.pdf';
    await fs.writeFile(outputPath, pdfBytes);
    
    console.log(`✅ A2 Form generated successfully!`);
    console.log(`📄 PDF saved to: ${outputPath}`);
    console.log(`📊 PDF size: ${pdfBytes.length} bytes`);
    
    return pdfBytes;
  } catch (error) {
    console.error('❌ Error generating A2 Form:', error);
    throw error;
  }
}

// Run the test
testGenerateA2Form()
  .then(() => {
    console.log('🎉 Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }); 