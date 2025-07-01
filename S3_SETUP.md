# AWS S3 + CloudFront Integration Setup

This guide explains how to set up and use AWS S3 with CloudFront for direct file uploads in the BuyEx B2B application.

## Prerequisites

1. AWS Account with appropriate permissions
2. S3 bucket configured for file storage
3. CloudFront distribution set up for CDN delivery
4. AWS credentials (Access Key ID and Secret Access Key)

## Environment Variables

Add these to your `.env.local` file:

```env
AWS_REGION=eu-north-1
AWS_S3_BUCKET=buyexb2b
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_CLOUDFRONT_DOMAIN=d28ujuh4jfaxae.cloudfront.net
```

## S3 Bucket CORS Configuration

To fix "Failed to fetch" errors, you need to configure CORS on your S3 bucket. Add this CORS configuration in your S3 bucket settings:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## S3 Bucket Policy

Ensure your S3 bucket has the correct policy to allow uploads:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::buyexb2b/*"
    }
  ]
}
```

## IAM User Permissions

Your IAM user needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::buyexb2b/*"
    }
  ]
}
```

## AWS Setup

### 1. S3 Bucket Configuration

1. Create an S3 bucket in your AWS console
2. Configure CORS for the bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Set bucket policy for CloudFront access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::your-account-id:distribution/your-distribution-id"
        }
      }
    }
  ]
}
```

### 2. CloudFront Distribution

1. Create a CloudFront distribution
2. Set origin to your S3 bucket
3. Configure origin access control (OAC)
4. Set up cache behaviors for optimal performance
5. Enable HTTPS and redirect HTTP to HTTPS

### 3. IAM Permissions

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Features

- **Direct S3 Upload**: Files uploaded directly to S3 using presigned URLs
- **CloudFront CDN**: Global content delivery with low latency
- **Secure Uploads**: Presigned URLs with expiration
- **File Validation**: Built-in file type and size validation
- **Progress Indicators**: Upload progress and status feedback
- **Preview Support**: File preview with CloudFront URLs

## Components

### 1. S3FileUploader

A React component that handles direct file uploads to S3 with CloudFront CDN delivery.

```tsx
import { S3FileUploader } from "./s3-file-uploader";

<S3FileUploader
  onFileUpload={(file, s3Url, s3Key) => {
    // Handle the uploaded file and S3 data
  }}
  currentFile={file}
  currentS3Url={s3Url}
  currentS3Key={s3Key}
  acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
  maxSizeMB={5}
  fieldName="Document"
  folder="buyex-documents"
/>;
```

### 2. API Route

The `/api/upload/s3` endpoint generates presigned URLs for direct S3 uploads:

```typescript
POST /api/upload/s3
Content-Type: application/json

{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "folder": "buyex-documents"
}
```

Response:

```json
{
  "success": true,
  "presignedUrl": "https://bucket.s3.amazonaws.com/...",
  "key": "buyex-documents/1234567890-document.pdf",
  "cloudFrontUrl": "https://your-domain.cloudfront.net/buyex-documents/1234567890-document.pdf",
  "fileName": "document.pdf",
  "fileType": "application/pdf"
}
```

## Usage Examples

### Basic File Upload

```tsx
import { useState } from "react";
import { S3FileUploader } from "./s3-file-uploader";

function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [s3Url, setS3Url] = useState<string>();
  const [s3Key, setS3Key] = useState<string>();

  const handleUpload = (file: File | null, url?: string, key?: string) => {
    setFile(file);
    setS3Url(url);
    setS3Key(key);
  };

  return (
    <S3FileUploader
      onFileUpload={handleUpload}
      currentFile={file}
      currentS3Url={s3Url}
      currentS3Key={s3Key}
      acceptedFileTypes={[".pdf", ".jpg", ".png"]}
      maxSizeMB={5}
      fieldName="Document"
    />
  );
}
```

### Multiple File Types

```tsx
// For images only
<S3FileUploader
  onFileUpload={handleUpload}
  currentFile={imageFile}
  acceptedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
  maxSizeMB={2}
  fieldName="Profile Picture"
  folder="profile-images"
/>

// For documents
<S3FileUploader
  onFileUpload={handleUpload}
  currentFile={documentFile}
  acceptedFileTypes={[".pdf", ".doc", ".docx"]}
  maxSizeMB={10}
  fieldName="Document"
  folder="documents"
/>
```

## Upload Process

1. **File Selection**: User selects or drags a file
2. **Validation**: File type and size validation
3. **Presigned URL**: API generates presigned URL for S3 upload
4. **Direct Upload**: File uploaded directly to S3 using presigned URL
5. **CloudFront URL**: CloudFront URL generated for CDN delivery
6. **Success**: File available via CloudFront CDN

## File Validation

The component uses the existing `fileUploadSchema` for validation:

- **File Types**: JPG, JPEG, PNG, PDF, WEBP
- **Max Size**: 5MB (configurable)
- **Required Fields**: File must be present and valid

## Error Handling

The component provides comprehensive error handling:

- File validation errors
- S3 upload failures
- Network errors
- Presigned URL generation errors

## Security Features

- Presigned URLs with expiration (1 hour)
- Direct S3 uploads (no server storage)
- CloudFront HTTPS delivery
- File type validation
- Size limits

## S3 Configuration

The S3 configuration is set up in `lib/s3.ts`:

```typescript
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
```

## Utility Functions

### generatePresignedUrl

```typescript
import { generatePresignedUrl } from "@/lib/s3";

const { url, key } = await generatePresignedUrl(
  "file.pdf",
  "application/pdf",
  "folder"
);
```

### deleteFromS3

```typescript
import { deleteFromS3 } from "@/lib/s3";

const success = await deleteFromS3("folder/file.pdf");
if (success) {
  console.log("File deleted successfully");
}
```

### getCloudFrontUrl

```typescript
import { getCloudFrontUrl } from "@/lib/s3";

const cloudFrontUrl = getCloudFrontUrl("folder/file.pdf");
```

## Testing

To test the S3 integration:

1. Set up your AWS environment variables
2. Configure S3 bucket and CloudFront distribution
3. Run the development server: `yarn dev`
4. Navigate to a page with the S3FileUploader
5. Upload a file and verify it appears in your S3 bucket
6. Check CloudFront URL for CDN delivery

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**: Ensure all AWS environment variables are properly configured
2. **S3 Bucket Permissions**: Check IAM permissions and bucket policies
3. **CloudFront Configuration**: Verify CloudFront distribution is properly set up
4. **CORS Errors**: Ensure S3 bucket CORS is configured correctly
5. **Presigned URL Expiration**: URLs expire after 1 hour

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Best Practices

1. **Use Folders**: Organize files in S3 folders for better management
2. **Validate Files**: Always validate files before upload
3. **Handle Errors**: Implement proper error handling for upload failures
4. **Monitor Costs**: Monitor S3 and CloudFront usage and costs
5. **Security**: Use least privilege IAM policies
6. **CDN**: Leverage CloudFront for global content delivery

## Cost Optimization

- Use S3 Intelligent Tiering for cost optimization
- Configure CloudFront caching for reduced S3 requests
- Monitor and optimize file sizes
- Use appropriate S3 storage classes

## Support

For issues with S3 integration, check:

- AWS S3 documentation: [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3)
- AWS CloudFront documentation: [docs.aws.amazon.com/cloudfront](https://docs.aws.amazon.com/cloudfront)
- AWS Console: [console.aws.amazon.com](https://console.aws.amazon.com)
- Application logs for detailed error messages

## Comparison: Cloudinary vs S3 + CloudFront

| Feature                 | Cloudinary  | S3 + CloudFront      |
| ----------------------- | ----------- | -------------------- |
| Setup Complexity        | Easy        | Moderate             |
| Cost                    | Pay-per-use | Pay-per-use          |
| CDN                     | Built-in    | CloudFront           |
| Image Optimization      | Automatic   | Manual/Third-party   |
| File Transformations    | Built-in    | Manual               |
| Direct Upload           | Yes         | Yes (Presigned URLs) |
| Custom Domain           | Yes         | Yes                  |
| Geographic Distribution | Global      | Global               |
| Storage                 | Managed     | Self-managed         |
| API                     | RESTful     | AWS SDK              |
