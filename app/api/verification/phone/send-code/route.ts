import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PhoneVerification from '@/lib/models/PhoneVerification';
import { oneSignalService } from '@/lib/utils/onesignal';
import { authenticateRequest } from '@/lib/utils/auth';

/**
 * POST /api/verification/phone/send-code
 * Send verification code to phone number via OneSignal SMS
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { phoneNumber, businessId } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = oneSignalService.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // Invalidate any existing unverified codes for this phone number
    await PhoneVerification.updateMany(
      {
        phoneNumber,
        verified: false,
        businessId: businessId || undefined,
      },
      {
        $set: { verified: true }, // Mark as used
      }
    );

    // Create new verification record
    const verification = new PhoneVerification({
      phoneNumber,
      code,
      businessId: businessId || undefined,
      userId: auth.userId,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    await verification.save();

    // Send SMS via OneSignal
    const smsResult = await oneSignalService.sendVerificationCode({
      phoneNumber,
      code,
    });

    if (!smsResult.success) {
      // Don't fail the request if SMS fails (for development/testing)
      // In production, you might want to handle this differently
      console.error('Failed to send SMS:', smsResult.error);
      
      // For development: return the code directly (remove in production!)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            message: 'Verification code generated (SMS failed, showing code for development)',
            code: code, // Remove this in production!
            expiresIn: 600, // 10 minutes in seconds
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to send verification code',
          details: smsResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Verification code sent successfully',
        expiresIn: 600, // 10 minutes in seconds
        // Don't send code in response for security
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Phone verification send error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

