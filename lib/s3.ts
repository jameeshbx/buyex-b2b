import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface S3UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function generatePresignedUrl(
  fileName: string,
  fileType: string,
  folder: string = 'buyex-documents'
): Promise<{ url: string; key: string }> {
  console.log("generatePresignedUrl called with:", { fileName, fileType, folder });
  console.log("Environment variables:", {
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? "SET" : "NOT SET",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "NOT SET",
  });
  
  const key = `${folder}/${Date.now()}-${fileName}`;
  console.log("Generated S3 key:", key);
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: fileType,
  });

  console.log("Creating presigned URL...");
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log("Presigned URL created successfully");
  
  return { url, key };
}

export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
}

export function getCloudFrontUrl(key: string): string {
  console.log("getCloudFrontUrl called with key:", key);
  console.log("AWS_CLOUDFRONT_DOMAIN:", process.env.AWS_CLOUDFRONT_DOMAIN);
  
  const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
  if (!cloudFrontDomain) {
    console.error("AWS_CLOUDFRONT_DOMAIN environment variable is not set");
    throw new Error('AWS_CLOUDFRONT_DOMAIN environment variable is required');
  }
  
  const url = `https://${cloudFrontDomain}/${key}`;
  console.log("Generated CloudFront URL:", url);
  return url;
} 