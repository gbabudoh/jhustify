import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import Verification from '@/lib/models/Verification';
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

    await connectDB();

    const body = await request.json();
    const {
      businessId,
      businessName,
      classification,
      contactPersonName,
      nationalIdSecureLink,
      registrationDocSecureLink,
      geoAddress,
      geoCoordinates,
    } = body;

    if (!businessId || !businessName || !classification || !contactPersonName || !nationalIdSecureLink || !geoAddress) {
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

    const business = await Business.findById(businessId);
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

    // Generate verification ID
    let verificationId = generateVerificationId();
    while (await Verification.findOne({ verificationId })) {
      verificationId = generateVerificationId();
    }

    // Create or update verification
    const verification = await Verification.findOneAndUpdate(
      { businessId },
      {
        verificationId,
        businessId,
        status: 'SUBMITTED',
        classification,
        nationalIdSecureLink,
        registrationDocSecureLink: classification === 'REGISTERED' ? registrationDocSecureLink : undefined,
        geoTagData: geoCoordinates
          ? {
              lat: geoCoordinates.lat,
              lng: geoCoordinates.lng,
              timestamp: new Date(),
            }
          : undefined,
        progressPercent: 20,
        nextStep: classification === 'REGISTERED' 
          ? 'Awaiting Formal Vetting Specialist review (FVS)'
          : 'Submit proof of presence (video/photos)',
      },
      { upsert: true, new: true }
    );

    // Update business status
    business.verificationStatus = 'SUBMITTED';
    business.verificationId = verificationId;
    await business.save();

    return NextResponse.json(
      {
        verificationId: verification.verificationId,
        status: 'SUBMITTED',
        message: 'Verification started. Awaiting automated checks.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Verification submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

