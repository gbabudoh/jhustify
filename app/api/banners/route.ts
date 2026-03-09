import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/auth';

// GET - Fetch banners (public for active banners, admin for all)
export async function GET(req: NextRequest) {
  try {
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

      if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }

      // Return all banners for admin
      const banners = await prisma.banner.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ banners }, { status: 200 });
    }

    // Return only active banners for public
    const now = new Date();
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ banners }, { status: 200 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error fetching banners:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST - Create new banner (Admin only)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await req.json(); // Fixed: using req instead of request
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

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        imageUrl,
        linkUrl,
        position,
        costPrice: parseFloat(costPrice),
        startDate: start,
        endDate: end,
        isActive: isActive !== undefined ? isActive : true,
        createdById: decoded.userId,
      },
    });

    return NextResponse.json({ banner, message: 'Banner created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error creating banner:', err);
    return NextResponse.json({ error: err.message || 'Failed to create banner' }, { status: 500 });
  }
}
