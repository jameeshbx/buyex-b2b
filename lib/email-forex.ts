import { sendEmailWithAttachment } from "./email";
import JSZip from "jszip";
import axios from "axios";
import { getCloudFrontUrl } from "./s3";

// Helper function to convert S3 keys to CloudFront URLs
const convertS3KeysToCloudFrontUrls = (s3Keys: string[]): string[] => {
  return s3Keys.map(key => {
    // Remove s3://bucket-name/ prefix if present
    const cleanKey = key.replace(/^s3:\/\/[^\/]+\//, '');
    return getCloudFrontUrl(cleanKey);
  });
};

export const sendEmailToForexPartner = async (documents: string[]) => {
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
    
    const email = "jameesh@buyexchange.in";
    const subject = "New Order - Documents Attached";
    const html = `
      <p>A new order has been created.</p>
      <p>Please find the attached documents in the zip file.</p>
      <p>Total documents: ${documents.length}</p>
    `;
    
    // Send email with zip attachment
    await sendEmailWithAttachment({ 
      to: email, 
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
  
  console.log('Testing sendEmailToForexPartner function...');
  await sendEmailToForexPartner(cloudFrontUrls);
  
  console.log('Test completed successfully!');
};