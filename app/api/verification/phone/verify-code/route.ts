import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

    const body = await request.json();
    const { phoneNumber, code, businessId } = body;

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Find verification record
    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phoneNumber,
        code,
        verified: false,
        expiresAt: { gt: new Date() }, // Not expired
        businessId: businessId || null,
      }
    });

    if (!verification) {
      // Increment attempts for rate limiting
      await prisma.phoneVerification.updateMany({
        where: { phoneNumber, verified: false },
        data: { attempts: { increment: 1 } }
      });

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
    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: {
        verified: true,
        attempts: { increment: 1 }
      }
    });

    // Update business mobile verification status if businessId provided
    if (businessId) {
      const business = await prisma.business.findUnique({
        where: { id: businessId }
      });
      
      if (business && business.ownerId === auth.userId) {
        await prisma.business.update({
          where: { id: businessId },
          data: { mobileVerified: true }
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Phone number verified successfully',
        verified: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Phone verification error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

