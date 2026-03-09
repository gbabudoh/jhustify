import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const verificationId = searchParams.get('verificationId');

    let business;
    let verification;

    if (verificationId) {
      // Fetch by verification ID
      verification = await prisma.verification.findUnique({
        where: { verificationId }
      });
      
      if (!verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        );
      }
      
      business = await prisma.business.findUnique({
        where: { id: verification.businessId }
      });
      
      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
    } else if (businessId) {
      // Fetch by business ID
      business = await prisma.business.findUnique({
        where: { id: businessId }
      });
      
      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }
      
      verification = await prisma.verification.findFirst({
        where: { businessId }
      });
    } else {
      return NextResponse.json(
        { error: 'Business ID or Verification ID is required' },
        { status: 400 }
      );
    }

    // Check ownership
    const isAdmin = auth.role === ('ADMIN' as import('@prisma/client').Role);
    const isTrustTeam = auth.role === ('TRUST_TEAM' as import('@prisma/client').Role);

    if (business.ownerId !== auth.userId && !isAdmin && !isTrustTeam) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    interface VerificationStatusResponse {
      status: import('@prisma/client').VerificationStatus;
      tier: import('@prisma/client').VerificationTier;
      trustBadgeActive: boolean;
      trustBadgeType: import('@prisma/client').TrustBadgeType | null;
      progressPercent: number;
      nextStep: string;
      verificationId?: string;
      verificationStatus?: import('@prisma/client').ApprovalStatus;
      verification?: {
        verificationId: string;
        status: import('@prisma/client').ApprovalStatus;
        classification: import('@prisma/client').Classification;
        nationalIdSecureLink: string | null;
        identityDocumentType: import('@prisma/client').IdentityDocType | null;
        registrationDocSecureLink: string | null;
        businessBankName: string | null;
        phoneVerified: boolean;
        progressPercent: number;
        nextStep: string | null;
      };
    }

    const response: VerificationStatusResponse = {
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
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Verification status error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

