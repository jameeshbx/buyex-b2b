// Simple test script to verify AWS S3 configuration
require('dotenv').config({ path: '.env' });

const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

async function testS3Connection() {
  console.log('Testing S3 connection...');
  console.log('Environment variables:');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
  console.log('AWS_CLOUDFRONT_DOMAIN:', process.env.AWS_CLOUDFRONT_DOMAIN);

  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    console.log('S3 client created successfully');

    // Test listing buckets
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    console.log('Successfully connected to AWS S3');
    console.log('Available buckets:', response.Buckets?.map(b => b.Name) || []);
    
    // Check if our bucket exists
    const targetBucket = process.env.AWS_S3_BUCKET;
    const bucketExists = response.Buckets?.some(b => b.Name === targetBucket);
    
    if (bucketExists) {
      console.log(`✅ Target bucket "${targetBucket}" exists`);
    } else {
      console.log(`❌ Target bucket "${targetBucket}" not found`);
      console.log('Available buckets:', response.Buckets?.map(b => b.Name) || []);
    }

  } catch (error) {
    console.error('❌ S3 connection failed:', error.message);
    if (error.name === 'InvalidAccessKeyId') {
      console.error('Invalid AWS Access Key ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('Invalid AWS Secret Access Key');
    } else if (error.name === 'NoSuchBucket') {
      console.error('Bucket does not exist');
    }
  }
}

testS3Connection(); 