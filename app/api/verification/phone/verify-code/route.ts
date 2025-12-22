import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PhoneVerification from '@/lib/models/PhoneVerification';
import Business from '@/lib/models/Business';
import { authenticateRequest } from '@/lib/utils/auth';

/**
 * POST /api/verification/phone/verify-code
 * Verify the phone verification code
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { phoneNumber, code, businessId } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Find verification record
    const verification = await PhoneVerification.findOne({
      phoneNumber,
      code,
      verified: false,
      expiresAt: { $gt: new Date() }, // Not expired
      businessId: businessId || undefined,
    });

    if (!verification) {
      // Increment attempts for rate limiting
      await PhoneVerification.updateOne(
        { phoneNumber, verified: false },
        { $inc: { attempts: 1 } }
      );

      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if too many attempts
    if (verification.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Mark as verified
    verification.verified = true;
    verification.attempts += 1;
    await verification.save();

    // Update business mobile verification status if businessId provided
    if (businessId) {
      const business = await Business.findById(businessId);
      if (business && business.ownerId.toString() === auth.userId) {
        business.mobileVerified = true;
        await business.save();
      }
    }

    return NextResponse.json(
      {
        message: 'Phone number verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Phone verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

