import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
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
    await connectDB();

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const businessId = resolvedParams.id;
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!businessId || businessId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid business ID format' },
        { status: 400 }
      );
    }

    const business = await Business.findById(businessId)
      .select('businessName category classification contactPersonName contactNumber email physicalAddress country city businessRepresentativePhoto verificationStatus verificationTier trustBadgeActive trustBadgeType averageRating ratingCount')
      .lean();

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB _id to id for response
    const businessData = business as any;
    const { _id, ...rest } = businessData;

    return NextResponse.json({
      business: {
        ...rest,
        id: _id?.toString() || businessData._id?.toString(),
      },
    });
  } catch (error: any) {
    console.error('Business fetch error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      params: params,
    });
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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

    await connectDB();

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const business = await Business.findById(resolvedParams.id);
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
    } = body;

    // Update allowed fields
    if (businessName) business.businessName = businessName;
    if (category) business.category = category;
    if (contactPersonName) business.contactPersonName = contactPersonName;
    if (contactNumber) business.contactNumber = contactNumber;
    if (email) business.email = email;
    if (physicalAddress) business.physicalAddress = physicalAddress;
    if (country) business.country = country;
    if (city !== undefined) business.city = city;
    if (businessRepresentativePhoto) business.businessRepresentativePhoto = businessRepresentativePhoto;
    if (verificationTier && (verificationTier === 'BASIC' || verificationTier === 'PREMIUM')) {
      business.verificationTier = verificationTier;
      // If upgrading to PREMIUM, also update trust badge to VERIFIED
      if (verificationTier === 'PREMIUM') {
        business.trustBadgeType = 'VERIFIED';
        business.trustBadgeActive = true;
      }
    }

    await business.save();

    return NextResponse.json({
      message: 'Business updated successfully',
      business: {
        id: business._id,
        businessName: business.businessName,
      },
    });
  } catch (error: any) {
    console.error('Business update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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

    await connectDB();

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const business = await Business.findById(resolvedParams.id);
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

    await business.deleteOne();

    return NextResponse.json({
      message: 'Business deleted successfully',
    });
  } catch (error: any) {
    console.error('Business delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
