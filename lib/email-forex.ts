import { sendEmailWithAttachment } from "./email";
import JSZip from "jszip";
import axios from "axios";
import { getCloudFrontUrl } from "./s3";
import { forexPartnerTemplate } from "./email-templates";

// Simple Order type for the email function
type Order = {
  id: string;
  createdAt: string;
  studentName?: string;
  currency?: string;
  customerRate?: number;
  ibrRate?: number;
  amount?: number;
  totalAmount?: number;
  purpose?: string;
  sender?: {
    studentName?: string;
    phoneNumber?: string;
    studentEmailOriginal?: string;
  };
  beneficiary?: {
    receiverFullName?: string;
  };
};

// Helper function to convert S3 keys to CloudFront URLs
const convertS3KeysToCloudFrontUrls = (s3Keys: string[]): string[] => {
  return s3Keys.map(key => {
    // Remove s3://bucket-name/ prefix if present
    const cleanKey = key.replace(/^s3:\/\/[^\/]+\//, '');
    return getCloudFrontUrl(cleanKey);
  });
};

export const sendEmailToForexPartner = async (
  order: Order,
  documents: string[],
  to: string
) => {
  try {
    // Download documents from S3 URLs and create zip
    const zip = new JSZip();
    
    // Download each document and add to zip
    for (let i = 0; i < documents.length; i++) {
      const documentUrl = documents[i];
      try {
        // Download the file from S3 URL
        const response = await axios.get(documentUrl, {
          responseType: 'arraybuffer',
          timeout: 30000, // 30 second timeout
        });
        
        // Extract filename from URL or use index
        const urlParts = documentUrl.split('/');
        const filename = urlParts[urlParts.length - 1] || `document_${i + 1}.pdf`;
        
        // Add file to zip
        zip.file(filename, response.data);
        
        console.log(`Successfully added ${filename} to zip`);
      } catch (error) {
        console.error(`Failed to download document ${i + 1}:`, error);
        // Continue with other documents even if one fails
      }
    }
    
    // Generate zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    const email = to;
    const subject = `New Order - Documents Attached (Order Id - ${order.id})`;
    const html: string = forexPartnerTemplate({
      orderDate: new Date(order.createdAt).toLocaleString(),
      orderId: order.id,
      senderName: order.sender?.studentName || order.studentName || "",
      phone: order.sender?.phoneNumber || "",
      email: order.sender?.studentEmailOriginal || "",
      purpose: order.purpose || "",
      receiverName: order.beneficiary?.receiverFullName || "",
      foreignCurrency: order.currency || "",
      product: order.purpose || "",
      rate: order.customerRate  || "",
      tentativeAmount: order.amount || "",
      totalPayableAmount: order.totalAmount || "",
      supportEmail: "forex@buyexchange.in",
      supportPhone: "+91 9633886611",
    });
    
    // Send email with zip attachment
    await sendEmailWithAttachment({ 
      to: email,
      cc: "forex@buyexchange.in",
      subject, 
      html,
      attachments: [{
        filename: 'order-documents.zip',
        content: zipBuffer,
        contentType: 'application/zip'
      }]
    });
    
    console.log('Email sent successfully with zip attachment');
  } catch (error) {
    console.error('Error sending email to forex partner:', error);
    throw error;
  }
};

// Test function for the provided S3 keys
export const testSendEmailToForexPartner = async () => {
  const s3Keys = [
    "s3://buyexb2b/buyex-documents/1750931857952-visa.pdf",
    "s3://buyexb2b/buyex-documents/1751008224658-Send_Money_Abroad_Quote-1750261100265.pdf",
    "s3://buyexb2b/buyex-documents/a2-forms/1751392660249-A2_Form_cmcior36h0004ejt87c08kr2v_2025-07-01.pdf"
  ];
  
  console.log('Converting S3 keys to CloudFront URLs...');
  const cloudFrontUrls = convertS3KeysToCloudFrontUrls(s3Keys);
  
  console.log('CloudFront URLs:');
  cloudFrontUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });
  
  // Create a mock order object for testing
  const mockOrder: Order = {
    id: "TEST-ORDER-001",
    createdAt: new Date().toISOString(),
    sender: {
      studentName: "Test Student",
      phoneNumber: "1234567890",
      studentEmailOriginal: "test@example.com"
    },
    purpose: "University fee transfer",
    beneficiary: {
      receiverFullName: "Test Receiver"
    },
    currency: "USD",
    customerRate: 85.50,
    amount: 1000,
    totalAmount: 85500
  };
  
  console.log('Testing sendEmailToForexPartner function...');
  await sendEmailToForexPartner(mockOrder, cloudFrontUrls, 'jameesh@buyexchange.in');
  
  console.log('Test completed successfully!');
};