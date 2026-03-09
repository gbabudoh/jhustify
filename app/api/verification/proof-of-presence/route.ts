import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { verificationId, videoSecureLink, geoTagData } = body;

    if (!verificationId || !videoSecureLink) {
      return NextResponse.json(
        { error: 'Verification ID and video link are required' },
        { status: 400 }
      );
    }

    const verification = await prisma.verification.findUnique({
      where: { verificationId }
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    // Ensure classification is treated as the correct enum type
    const classification: import('@prisma/client').Classification = verification.classification as import('@prisma/client').Classification;

    if (classification !== 'UNREGISTERED') {
      return NextResponse.json(
        { error: 'Proof of presence is only required for unregistered businesses' },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: verification.businessId }
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (business.ownerId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update verification with proof of presence
    const updateData: import('@prisma/client').Prisma.VerificationUpdateInput = {
      proofOfPresenceVideoLink: videoSecureLink,
      status: 'IN_REVIEW',
      progressPercent: 60,
      nextStep: 'Awaiting Informal Vetting Auditor review (IVA)'
    };

    if (geoTagData) {
      updateData.lat = geoTagData.lat;
      updateData.lng = geoTagData.lng;
      updateData.geoTimestamp = new Date();
    }

    await prisma.verification.update({
      where: { id: verification.id },
      data: updateData
    });

    // Update business status
    await prisma.business.update({
      where: { id: business.id },
      data: { verificationStatus: 'IN_REVIEW' }
    });

    return NextResponse.json(
      {
        verificationId: verification.verificationId,
        status: 'PROOF_RECEIVED',
        message: 'Video accepted. Awaiting Manual Audit.',
      },
      { status: 202 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Proof of presence submission error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

