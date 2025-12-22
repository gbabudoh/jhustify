import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const classification = searchParams.get('classification');
    const verificationStatus = searchParams.get('verificationStatus');
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: any = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (classification) {
      query.classification = classification;
    }
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }
    if (country) {
      query.country = country;
    }
    if (city) {
      query.city = city;
    }

    const skip = (page - 1) * limit;

    const businesses = await Business.find(query)
      .select('-ownerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(query);

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Business fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
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
    } = body;

    if (!businessName || !category || !classification || !contactPersonName || !contactNumber || !email || !physicalAddress || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
      ownerId: auth.userId,
      verificationStatus: 'UNVERIFIED',
      verificationTier: 'BASIC',
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

