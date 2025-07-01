import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUrl, getCloudFrontUrl } from '@/lib/s3';

export async function GET() {
  // CORS test endpoint
  return NextResponse.json({ 
    message: 'S3 upload API is working',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("S3 upload API called");
    
    const body = await request.json();
    console.log("Request body:", body);
    
    const { fileName, fileType, folder = 'buyex-documents' } = body;

    if (!fileName || !fileType) {
      console.error("Missing required fields:", { fileName, fileType });
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Validate file type and extension
    const extension = fileName.split(".").pop()?.toLowerCase();
    const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const acceptedPdfTypes = ["application/pdf"];
    
    let isValidType = false;
    
    // For images
    if (["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
      isValidType = acceptedImageTypes.includes(fileType);
    }
    // For PDFs
    else if (extension === "pdf") {
      isValidType = acceptedPdfTypes.includes(fileType);
    }
    
    if (!isValidType) {
      console.error("Invalid file type:", { fileName, fileType, extension });
      return NextResponse.json(
        { error: 'Only .jpg, .jpeg, .png, .webp and .pdf files are allowed' },
        { status: 400 }
      );
    }

    console.log("Generating presigned URL...");
    // Generate presigned URL for direct S3 upload
    const { url: presignedUrl, key } = await generatePresignedUrl(fileName, fileType, folder);
    console.log("Presigned URL generated:", { key, presignedUrl: presignedUrl.substring(0, 50) + "..." });
    
    console.log("Generating CloudFront URL...");
    // Generate CloudFront URL for the uploaded file
    const cloudFrontUrl = getCloudFrontUrl(key);
    console.log("CloudFront URL generated:", cloudFrontUrl);

    const response = {
      success: true,
      presignedUrl,
      key,
      cloudFrontUrl,
      fileName,
      fileType
    };
    
    console.log("Sending successful response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('S3 upload API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 