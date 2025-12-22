import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import Verification from '@/lib/models/Verification';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const verificationId = searchParams.get('verificationId');

    let business;
    let verification;

    if (verificationId) {
      // Fetch by verification ID
      verification = await Verification.findOne({ verificationId });
      if (!verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        );
      }
      business = await Business.findById(verification.businessId);
      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
    } else if (businessId) {
      // Fetch by business ID
      business = await Business.findById(businessId);
      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
      verification = await Verification.findOne({ businessId });
    } else {
      return NextResponse.json(
        { error: 'Business ID or Verification ID is required' },
        { status: 400 }
      );
    }

    // Check ownership
    if (business.ownerId.toString() !== auth.userId && auth.role !== 'ADMIN' && auth.role !== 'TRUST_TEAM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const response: any = {
      status: business.verificationStatus,
      tier: business.verificationTier,
      trustBadgeActive: business.trustBadgeActive,
      trustBadgeType: business.trustBadgeType,
      progressPercent: verification?.progressPercent || 0,
      nextStep: verification?.nextStep || 'Start verification process',
    };

    if (verification) {
      response.verificationId = verification.verificationId;
      response.verificationStatus = verification.status;
      response.verification = {
        verificationId: verification.verificationId,
        status: verification.status,
        classification: verification.classification,
        nationalIdSecureLink: verification.nationalIdSecureLink,
        identityDocumentType: verification.identityDocumentType,
        registrationDocSecureLink: verification.registrationDocSecureLink,
        businessBankName: verification.businessBankName,
        phoneVerified: verification.phoneVerified,
        progressPercent: verification.progressPercent,
        nextStep: verification.nextStep,
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Verification status error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

