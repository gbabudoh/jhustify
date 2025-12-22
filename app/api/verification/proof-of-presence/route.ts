import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import Verification from '@/lib/models/Verification';
import { authenticateRequest } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { verificationId, videoSecureLink, geoTagData, notes } = body;

    if (!verificationId || !videoSecureLink) {
      return NextResponse.json(
        { error: 'Verification ID and video link are required' },
        { status: 400 }
      );
    }

    const verification = await Verification.findOne({ verificationId });
    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    if (verification.classification !== 'UNREGISTERED') {
      return NextResponse.json(
        { error: 'Proof of presence is only required for unregistered businesses' },
        { status: 400 }
      );
    }

    const business = await Business.findById(verification.businessId);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (business.ownerId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update verification with proof of presence
    verification.proofOfPresenceVideoLink = videoSecureLink;
    if (geoTagData) {
      verification.geoTagData = {
        lat: geoTagData.lat,
        lng: geoTagData.lng,
        timestamp: new Date(),
      };
    }
    verification.status = 'IN_REVIEW';
    verification.progressPercent = 60;
    verification.nextStep = 'Awaiting Informal Vetting Auditor review (IVA)';
    await verification.save();

    // Update business status
    business.verificationStatus = 'IN_REVIEW';
    await business.save();

    return NextResponse.json(
      {
        verificationId: verification.verificationId,
        status: 'PROOF_RECEIVED',
        message: 'Video accepted. Awaiting Manual Audit.',
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error('Proof of presence submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

