import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const classification = searchParams.get('classification') || '';
    const verificationStatus = searchParams.get('verificationStatus') || '';
    const country = searchParams.get('country') || '';
    const city = searchParams.get('city') || '';
    const ownerId = searchParams.get('ownerId') || '';
    const page = parseInt(searchParams.get('page') || '1') || 1;
    const limit = parseInt(searchParams.get('limit') || '20') || 20;

    const where: import('@prisma/client').Prisma.BusinessWhereInput = {};

    // If ownerId is provided, require authentication and filter by owner
    if (ownerId) {
      const auth = await authenticateRequest(request);
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized', businesses: [] }, { status: 401 });
      }
      if (ownerId !== auth.userId) {
        return NextResponse.json({ error: 'Forbidden', businesses: [] }, { status: 403 });
      }
      where.ownerId = ownerId;
    }

    // Search across multiple fields
    if (search.trim()) {
      where.OR = [
        { businessName: { contains: search.trim(), mode: 'insensitive' } },
        { category: { contains: search.trim(), mode: 'insensitive' } },
        { physicalAddress: { contains: search.trim(), mode: 'insensitive' } },
        { city: { contains: search.trim(), mode: 'insensitive' } },
        { country: { contains: search.trim(), mode: 'insensitive' } },
        { contactPersonName: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // Filters
    if (category.trim()) where.category = { equals: category.trim(), mode: 'insensitive' };
    if (classification.trim()) where.classification = classification.trim() as import('@prisma/client').Classification;
    if (verificationStatus.trim()) where.verificationStatus = verificationStatus.trim() as import('@prisma/client').VerificationStatus;
    if (country.trim()) where.country = { equals: country.trim(), mode: 'insensitive' };
    if (city.trim()) where.city = { contains: city.trim(), mode: 'insensitive' };

    const skip = (page - 1) * limit;

    // Fetch businesses and total count
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        select: {
          id: true,
          businessName: true,
          category: true,
          classification: true,
          contactPersonName: true,
          contactNumber: true,
          email: true,
          physicalAddress: true,
          country: true,
          city: true,
          businessRepresentativePhoto: true,
          verificationStatus: true,
          verificationTier: true,
          trustBadgeActive: true,
          trustBadgeType: true,
          verificationId: !!ownerId, // only show if owner is requesting
          averageRating: true,
          ratingCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business fetch error:', err.message);
    return NextResponse.json({
      businesses: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      error: err.message || 'Internal server error',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      category,
      classification,
      contactPersonName,
      contactNumber,
      email,
      physicalAddress,
      country,
      city,
      lat,
      lng,
      businessRepresentativePhoto,
      businessDescription,
      offeredItems,
      businessType,
      yearsInOperation,
      socialLinks,
      paymentMethods,
    } = body;

    if (!businessName || !category || !classification || !contactPersonName || !contactNumber || !email || !physicalAddress || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const badgeType = classification === 'REGISTERED' ? 'FORMAL' : 'INFORMAL';
    
    // Define an extended type to handle potentially unsynced Prisma types while satisfying ESLint
    interface ExtendedBusinessCreateInput extends Prisma.BusinessCreateInput {
      businessDescription?: string | null;
      offeredItems?: Prisma.InputJsonValue;
      businessType?: string;
      yearsInOperation?: number | null;
      socialLinks?: Prisma.InputJsonValue;
      paymentMethods?: import('@prisma/client').PaymentMethod[];
    }

    const business = await prisma.business.create({
      data: {
        businessName,
        category,
        classification,
        contactPersonName,
        contactNumber,
        email: email.toLowerCase(),
        physicalAddress,
        country,
        city,
        lat,
        lng,
        businessRepresentativePhoto,
        ownerId: auth.userId,
        verificationStatus: 'UNVERIFIED',
        verificationTier: 'BASIC',
        trustBadgeActive: true,
        trustBadgeType: badgeType as import('@prisma/client').TrustBadgeType,
        mobileVerified: false,
        businessDescription,
        offeredItems: offeredItems as import('@prisma/client').Prisma.InputJsonValue,
        businessType: businessType || 'PRODUCT',
        yearsInOperation: yearsInOperation ? parseInt(yearsInOperation.toString()) : null,
        socialLinks: socialLinks as import('@prisma/client').Prisma.InputJsonValue,
        paymentMethods: paymentMethods ? { set: paymentMethods } : undefined,
      } as unknown as ExtendedBusinessCreateInput as unknown as Prisma.BusinessCreateInput,
    });

    return NextResponse.json(
      {
        message: 'Business created successfully',
        business: {
          id: business.id,
          businessName: business.businessName,
          verificationStatus: business.verificationStatus,
          verificationTier: business.verificationTier,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Business creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
