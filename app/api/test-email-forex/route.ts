import { NextResponse } from 'next/server';
import { testSendEmailToForexPartner } from '@/lib/email-forex';

export async function POST() {
  try {
    console.log('Testing email forex function...');
    
    await testSendEmailToForexPartner();
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully with zip attachment'
    });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email forex test endpoint',
    usage: 'POST to test the email function with sample S3 documents'
  });
} 