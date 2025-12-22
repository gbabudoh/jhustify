import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { verifyToken } from '@/lib/utils/auth';

// GET - Fetch banners (public for active banners, admin for all)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    // Check if admin is requesting all banners
    if (showAll) {
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);

      if (!decoded || decoded.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }

      // Return all banners for admin
      const banners = await Banner.find().sort({ createdAt: -1 });
      return NextResponse.json({ banners }, { status: 200 });
    }

    // Return only active banners for public
    const banners = await Banner.getActiveBanners();
    return NextResponse.json({ banners }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST - Create new banner (Admin only)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, imageUrl, linkUrl, position, costPrice, startDate, endDate, isActive } = body;

    // Validation
    if (!title || !imageUrl || !position || costPrice === undefined || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const banner = await Banner.create({
      title,
      description,
      imageUrl,
      linkUrl,
      position,
      costPrice: parseFloat(costPrice),
      startDate: start,
      endDate: end,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: decoded.userId,
    });

    return NextResponse.json({ banner, message: 'Banner created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}
