import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
    await prisma.phoneVerification.updateMany({
      where: {
        phoneNumber,
        verified: false,
        businessId: businessId || null,
      },
      data: {
        verified: true, // Mark as used
      }
    });

    // Create new verification record
    await prisma.phoneVerification.create({
      data: {
        phoneNumber,
        code,
        businessId: businessId || null,
        userId: auth.userId,
        expiresAt,
        attempts: 0,
        verified: false,
      }
    });

    // Send SMS via OneSignal
    const smsResult = await oneSignalService.sendVerificationCode({
      phoneNumber,
      code,
    });

    if (!smsResult.success) {
      // Don't fail the request if SMS fails (for development/testing)
      console.error('Failed to send SMS:', smsResult.error);
      
      // For development: return the code directly
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            message: 'Verification code generated (SMS failed, showing code for development)',
            code: code,
            expiresIn: 600,
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
        expiresIn: 600,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Phone verification send error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

