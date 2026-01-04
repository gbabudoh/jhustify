import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Business from '@/lib/models/Business';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('verificationStatus');
    const tier = searchParams.get('verificationTier');
    const search = searchParams.get('search');

    const query: any = {};
    if (status) {
      query.verificationStatus = status;
    }
    if (tier) {
      query.verificationTier = tier;
    }
    if (search) {
      query.$or = [
        { businessName: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const skip = (page - 1) * limit;
    const businesses = await Business.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Business.countDocuments(query);

    const businessesWithId = businesses.map((business: any) => {
      const { _id, ownerId, ...rest } = business;
      return {
        ...rest,
        id: _id?.toString(),
        owner: ownerId ? {
          id: ownerId._id?.toString(),
          name: ownerId.name,
          email: ownerId.email,
        } : null,
      };
    });

    return NextResponse.json({
      businesses: businessesWithId,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin businesses fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { businessId, ...updates } = body;

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const business = await Business.findByIdAndUpdate(
      businessId,
      updates,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const businessData = business.toObject();
    const { _id, ownerId, ...rest } = businessData;
    
    return NextResponse.json({
      business: {
        ...rest,
        id: _id?.toString(),
        owner: ownerId ? {
          id: ownerId._id?.toString(),
          name: ownerId.name,
          email: ownerId.email,
        } : null,
      },
      message: 'Business updated successfully',
    });
  } catch (error: any) {
    console.error('Admin business update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const business = await Business.findByIdAndDelete(businessId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error: any) {
    console.error('Admin business delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

