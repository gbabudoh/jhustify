import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { authenticateRequest } from '@/lib/utils/auth';

/**
 * GET /api/business/[id]
 * Get a single business by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const businessId = resolvedParams.id;
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
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

    return NextResponse.json({ business });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business fetch error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/business/[id]
 * Update a business
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const businessId = resolvedParams.id;

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

    const body = await request.json();
    const {
      businessName,
      category,
      contactPersonName,
      contactNumber,
      email,
      physicalAddress,
      country,
      city,
      businessRepresentativePhoto,
      verificationTier,
      socialLinks,
      paymentMethods,
      mediaGallery,
      yearsInOperation,
      businessDescription,
      offeredItems,
      businessType,
    } = body;

    // Define an extended type to handle potentially unsynced Prisma types while satisfying ESLint
    interface ExtendedUpdateInput extends Prisma.BusinessUpdateInput {
      businessDescription?: string | null;
      offeredItems?: Prisma.InputJsonValue;
      businessType?: string;
    }

    const updateData: ExtendedUpdateInput = {};
    
    if (businessName !== undefined) updateData.businessName = businessName;
    if (category !== undefined) updateData.category = category;
    if (contactPersonName !== undefined) updateData.contactPersonName = contactPersonName;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (email !== undefined) updateData.email = email;
    if (physicalAddress !== undefined) updateData.physicalAddress = physicalAddress;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (businessRepresentativePhoto !== undefined) updateData.businessRepresentativePhoto = businessRepresentativePhoto;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks as import('@prisma/client').Prisma.InputJsonValue;
    if (paymentMethods !== undefined) updateData.paymentMethods = paymentMethods as import('@prisma/client').PaymentMethod[];
    if (mediaGallery !== undefined) updateData.mediaGallery = mediaGallery;
    if (yearsInOperation !== undefined) updateData.yearsInOperation = yearsInOperation ? parseInt(String(yearsInOperation)) : null;
    if (businessDescription !== undefined) updateData.businessDescription = businessDescription;
    if (offeredItems !== undefined) updateData.offeredItems = offeredItems as Prisma.InputJsonValue;
    if (businessType !== undefined) updateData.businessType = String(businessType);
    if (verificationTier && (verificationTier === 'BASIC' || verificationTier === 'PREMIUM')) {
      updateData.verificationTier = verificationTier as import('@prisma/client').VerificationTier;
      if (verificationTier === 'PREMIUM') {
        updateData.trustBadgeType = 'VERIFIED' as import('@prisma/client').TrustBadgeType;
        updateData.trustBadgeActive = true;
      }
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: updateData as unknown as Prisma.BusinessUpdateInput
    });

    return NextResponse.json({
      message: 'Business updated successfully',
      business: {
        id: updatedBusiness.id,
        businessName: updatedBusiness.businessName,
      },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business update error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/business/[id]
 * Delete a business
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const businessId = resolvedParams.id;

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

    await prisma.business.delete({
      where: { id: businessId }
    });

    return NextResponse.json({
      message: 'Business deleted successfully',
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business delete error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/business/[id]
 * Specifically for incrementing views or toggle small fields
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const businessId = resolvedParams.id;
    
    const { action } = await request.json();

    if (action === 'increment_views') {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          // @ts-expect-error - views field added in recent migration, types might not be updated yet
          views: {
            increment: 1
          }
        }
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business patch error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
