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

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (business.ownerId.toString() !== auth.userId && auth.role !== 'ADMIN' && auth.role !== 'TRUST_TEAM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const verification = await Verification.findOne({ businessId });

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

