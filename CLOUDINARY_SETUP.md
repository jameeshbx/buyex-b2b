# Cloudinary Integration Setup

This guide explains how to set up and use Cloudinary for file uploads in the BuyEx B2B application.

## Prerequisites

1. A Cloudinary account (sign up at [cloudinary.com](https://cloudinary.com))
2. Your Cloudinary credentials (Cloud Name, API Key, API Secret)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Features

- **Automatic S3 Storage**: Cloudinary automatically stores files in S3-compatible storage
- **File Optimization**: Automatic image optimization and format conversion
- **Secure URLs**: HTTPS URLs with automatic CDN delivery
- **File Validation**: Built-in file type and size validation
- **Progress Indicators**: Upload progress and status feedback
- **Preview Support**: File preview with Cloudinary URLs

## Components

### 1. CloudinaryFileUploader

A React component that handles file uploads to Cloudinary with drag-and-drop support.

```tsx
import { CloudinaryFileUploader } from "./cloudinary-file-uploader";

<CloudinaryFileUploader
  onFileUpload={(file, cloudinaryUrl, publicId) => {
    // Handle the uploaded file and Cloudinary data
  }}
  currentFile={file}
  currentCloudinaryUrl={cloudinaryUrl}
  currentPublicId={publicId}
  acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
  maxSizeMB={5}
  fieldName="Document"
  folder="buyex-documents"
/>;
```

### 2. API Route

The `/api/upload/cloudinary` endpoint handles file uploads:

```typescript
POST /api/upload/cloudinary
Content-Type: multipart/form-data

Form data:
- file: The file to upload
- folder: (optional) Cloudinary folder name
```

Response:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "buyex-documents/...",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf"
}
```

## Usage Examples

### Basic File Upload

```tsx
import { useState } from "react";
import { CloudinaryFileUploader } from "./cloudinary-file-uploader";

function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>();
  const [publicId, setPublicId] = useState<string>();

  const handleUpload = (file: File | null, url?: string, id?: string) => {
    setFile(file);
    setCloudinaryUrl(url);
    setPublicId(id);
  };

  return (
    <CloudinaryFileUploader
      onFileUpload={handleUpload}
      currentFile={file}
      currentCloudinaryUrl={cloudinaryUrl}
      currentPublicId={publicId}
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
<CloudinaryFileUploader
  onFileUpload={handleUpload}
  currentFile={imageFile}
  acceptedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
  maxSizeMB={2}
  fieldName="Profile Picture"
  folder="profile-images"
/>

// For documents
<CloudinaryFileUploader
  onFileUpload={handleUpload}
  currentFile={documentFile}
  acceptedFileTypes={[".pdf", ".doc", ".docx"]}
  maxSizeMB={10}
  fieldName="Document"
  folder="documents"
/>
```

## File Validation

The component uses the existing `fileUploadSchema` for validation:

- **File Types**: JPG, JPEG, PNG, PDF, WEBP
- **Max Size**: 5MB (configurable)
- **Required Fields**: File must be present and valid

## Error Handling

The component provides comprehensive error handling:

- File validation errors
- Upload failures
- Network errors
- Cloudinary API errors

## Security Features

- File type validation
- Size limits
- Secure HTTPS URLs
- Automatic file optimization
- CDN delivery

## Cloudinary Configuration

The Cloudinary configuration is set up in `lib/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

## Utility Functions

### uploadToCloudinary

```typescript
import { uploadToCloudinary } from "@/lib/upload";

const result = await uploadToCloudinary(file, "folder-name");
if (result.success) {
  console.log("Upload URL:", result.url);
  console.log("Public ID:", result.publicId);
}
```

### deleteFromCloudinary

```typescript
import { deleteFromCloudinary } from "@/lib/upload";

const success = await deleteFromCloudinary("public-id");
if (success) {
  console.log("File deleted successfully");
}
```

## Testing

To test the Cloudinary integration:

1. Set up your environment variables
2. Run the development server: `yarn dev`
3. Navigate to a page with the CloudinaryFileUploader
4. Upload a file and verify it appears in your Cloudinary dashboard

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**: Ensure all Cloudinary environment variables are properly configured
2. **File Size Too Large**: Check the `maxSizeMB` prop and Cloudinary account limits
3. **Invalid File Type**: Verify the `acceptedFileTypes` array includes your file type
4. **Upload Fails**: Check browser console for detailed error messages

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Best Practices

1. **Use Folders**: Organize files in Cloudinary folders for better management
2. **Validate Files**: Always validate files before upload
3. **Handle Errors**: Implement proper error handling for upload failures
4. **Optimize Images**: Use Cloudinary's automatic optimization features
5. **Secure URLs**: Always use HTTPS URLs for file access

## Support

For issues with Cloudinary integration, check:

- Cloudinary documentation: [docs.cloudinary.com](https://docs.cloudinary.com)
- Cloudinary dashboard: [cloudinary.com/console](https://cloudinary.com/console)
- Application logs for detailed error messages
