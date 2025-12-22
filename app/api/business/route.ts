import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import { authenticateRequest } from '@/lib/utils/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Parse URL safely
    let searchParams: URLSearchParams;
    try {
      searchParams = new URL(request.url).searchParams;
    } catch (urlError) {
      console.error('URL parsing error:', urlError);
      return NextResponse.json({
        businesses: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });
    }

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const classification = searchParams.get('classification') || '';
    const verificationStatus = searchParams.get('verificationStatus') || '';
    const country = searchParams.get('country') || '';
    const city = searchParams.get('city') || '';
    const ownerId = searchParams.get('ownerId') || '';
    const page = parseInt(searchParams.get('page') || '1') || 1;
    const limit = parseInt(searchParams.get('limit') || '20') || 20;

    const query: any = {};

    // If ownerId is provided, require authentication and filter by owner
    if (ownerId) {
      const auth = await authenticateRequest(request);
      if (!auth) {
        return NextResponse.json({ error: 'Unauthorized', businesses: [] }, { status: 401 });
      }
      if (ownerId !== auth.userId) {
        return NextResponse.json({ error: 'Forbidden', businesses: [] }, { status: 403 });
      }
      if (mongoose.Types.ObjectId.isValid(ownerId)) {
        query.ownerId = new mongoose.Types.ObjectId(ownerId);
      } else {
        return NextResponse.json({ error: 'Invalid owner ID', businesses: [] }, { status: 400 });
      }
    }

    // Search across multiple fields using regex
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { businessName: searchRegex },
        { category: searchRegex },
        { physicalAddress: searchRegex },
        { city: searchRegex },
        { country: searchRegex },
        { contactPersonName: searchRegex },
      ];
    }

    // Add filters
    if (category.trim()) query.category = category.trim();
    if (classification.trim()) query.classification = classification.trim();
    if (verificationStatus.trim()) query.verificationStatus = verificationStatus.trim();
    if (country.trim()) query.country = country.trim();
    if (city.trim()) query.city = city.trim();

    const skip = (page - 1) * limit;

    // Select fields
    const selectFields = ownerId
      ? 'businessName category classification contactPersonName contactNumber email physicalAddress country city businessRepresentativePhoto verificationStatus verificationTier trustBadgeActive trustBadgeType verificationId averageRating ratingCount createdAt'
      : 'businessName category classification contactPersonName contactNumber email physicalAddress country city businessRepresentativePhoto verificationStatus verificationTier trustBadgeActive trustBadgeType averageRating ratingCount createdAt';

    // Fetch businesses
    let businesses: any[] = [];
    try {
      businesses = await Business.find(query)
        .select(selectFields)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (dbError: any) {
      console.error('Database query error:', dbError.message);
      return NextResponse.json({
        businesses: [],
        pagination: { page, limit, total: 0, pages: 0 },
        error: 'Database error',
      });
    }

    // Get total count
    let total = 0;
    try {
      total = await Business.countDocuments(query);
    } catch (countError) {
      total = businesses.length;
    }

    // Map businesses to include id
    const businessesWithId = businesses.map((business: any) => {
      const { _id, ...rest } = business;
      return {
        ...rest,
        id: _id?.toString() || '',
        _id: _id?.toString() || '',
      };
    });

    return NextResponse.json({
      businesses: businessesWithId,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error('Business fetch error:', error.message);
    return NextResponse.json({
      businesses: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      error: error.message || 'Internal server error',
    });
  }
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
      businessName,
      category,
      classification,
      contactPersonName,
      contactNumber,
      email,
      physicalAddress,
      country,
      city,
      geoCoordinates,
      businessRepresentativePhoto,
    } = body;

    if (!businessName || !category || !classification || !contactPersonName || !contactNumber || !email || !physicalAddress || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const badgeType = classification === 'REGISTERED' ? 'FORMAL' : 'INFORMAL';

    const business = new Business({
      businessName,
      category,
      classification,
      contactPersonName,
      contactNumber,
      email,
      physicalAddress,
      country,
      city,
      geoCoordinates,
      businessRepresentativePhoto,
      ownerId: auth.userId,
      verificationStatus: 'UNVERIFIED',
      verificationTier: 'BASIC',
      trustBadgeActive: true,
      trustBadgeType: badgeType,
      mobileVerified: false,
    });

    await business.save();

    return NextResponse.json(
      {
        message: 'Business created successfully',
        business: {
          id: business._id,
          businessName: business.businessName,
          verificationStatus: business.verificationStatus,
          verificationTier: business.verificationTier,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Business creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
