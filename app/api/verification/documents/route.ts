import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';
import { randomBytes } from 'crypto';

function generateVerificationId(): string {
  return 'VHX' + randomBytes(4).toString('hex').toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessId,
      classification,
      nationalIdSecureLink,
      identityDocumentType,
      registrationDocSecureLink,
      businessBankName,
      geoCoordinates,
    } = body;

    if (!businessId || !classification || !nationalIdSecureLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (classification === 'REGISTERED' && !registrationDocSecureLink) {
      return NextResponse.json(
        { error: 'Registration document is required for registered businesses' },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId }
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

    // Unique verification ID generation logic
    const existing = await prisma.verification.findFirst({
      where: { businessId }
    });

    let verificationId = existing?.verificationId;
    
    if (!verificationId) {
      let isUnique = false;
      while (!isUnique) {
        verificationId = generateVerificationId();
        const check = await prisma.verification.findUnique({
          where: { verificationId }
        });
        if (!check) isUnique = true;
      }
    }

    // Explicitly define update/create data using Unchecked types to allow direct ID assignments
    const verificationData: import('@prisma/client').Prisma.VerificationUncheckedUpdateInput = {
      verificationId: verificationId as string,
      businessId,
      status: 'SUBMITTED',
      classification: classification as import('@prisma/client').Classification,
      nationalIdSecureLink,
      identityDocumentType: identityDocumentType || null,
      businessBankName: businessBankName || null,
      registrationDocSecureLink: classification === 'REGISTERED' ? registrationDocSecureLink : null,
      progressPercent: 20,
      nextStep: classification === 'REGISTERED' 
        ? 'Awaiting Formal Vetting Specialist review (FVS)'
        : 'Submit proof of presence (video/photos)',
    };

    if (geoCoordinates) {
      verificationData.lat = geoCoordinates.lat;
      verificationData.lng = geoCoordinates.lng;
      verificationData.geoTimestamp = new Date();
    }

    let verification;
    if (existing) {
      verification = await prisma.verification.update({
        where: { id: existing.id },
        data: verificationData
      });
    } else {
      verification = await prisma.verification.create({
        data: verificationData as import('@prisma/client').Prisma.VerificationUncheckedCreateInput
      });
    }

    // Update business status
    await prisma.business.update({
      where: { id: businessId },
      data: {
        verificationStatus: 'SUBMITTED',
        verificationId: verificationId
      }
    });

    return NextResponse.json(
      {
        verificationId: verification.verificationId,
        status: 'SUBMITTED',
        message: 'Verification started. Awaiting automated checks.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Verification submission error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

