import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    const isAllowed = auth && ['ADMIN', 'SUPER_ADMIN', 'TRUST_TEAM'].includes(auth.role);
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [verifications, total] = await Promise.all([
      prisma.verification.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              classification: true,
              owner: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          reviewer: {
            select: {
              name: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.verification.count({ where })
    ]);

    return NextResponse.json({
      verifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Verifications fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    const isAllowed = auth && ['ADMIN', 'SUPER_ADMIN', 'TRUST_TEAM'].includes(auth.role);
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { verificationId, status, reviewerNotes, tierUpdate } = body;

    if (!verificationId) {
      return NextResponse.json({ error: 'Verification ID is required' }, { status: 400 });
    }

    // Start a transaction to ensure both verification and business are updated
    const result = await prisma.$transaction(async (tx) => {
      const verification = await tx.verification.update({
        where: { id: verificationId },
        data: {
          status,
          reviewerNotes,
          reviewerId: auth.userId,
          reviewedAt: new Date(),
          progressPercent: status === 'APPROVED' ? 100 : (status === 'REJECTED' ? 0 : 50)
        }
      });

      // Map ApprovalStatus to VerificationStatus
      let businessStatus: any = 'IN_REVIEW';
      if (status === 'APPROVED') businessStatus = 'VERIFIED';
      if (status === 'REJECTED') businessStatus = 'REJECTED';

      const businessUpdate: any = {
        verificationStatus: businessStatus,
      };

      if (status === 'APPROVED') {
        businessUpdate.trustBadgeActive = true;
        if (tierUpdate) {
          businessUpdate.verificationTier = tierUpdate;
        }
      }

      await tx.business.update({
        where: { id: verification.businessId },
        data: businessUpdate
      });

      return verification;
    });

    return NextResponse.json({
      message: 'Verification updated successfully',
      verification: result
    });
  } catch (error: any) {
    console.error('Verification update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
