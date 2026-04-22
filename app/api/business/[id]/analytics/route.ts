import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { id },
      select: {
        id: true,
        businessName: true,
        views: true,
        trustScore: true,
        averageRating: true,
        ratingCount: true,
        ownerId: true,
        createdAt: true,
      }
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check ownership or admin status
    if (business.ownerId !== auth.userId && !['ADMIN', 'SUPER_ADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // In a real app, we'd fetch daily view data from a separate Analytics model
    // For this MVP, we'll generate some mock trend data based on total views
    const generateTrend = (total: number, days: number) => {
      const trend = [];
      const now = new Date();
      let remaining = total;
      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - 1 - i));
        const daily = Math.floor(remaining / (days - i)) + Math.floor(Math.random() * 5);
        trend.push({
          date: date.toISOString().split('T')[0],
          views: daily
        });
        remaining -= daily;
      }
      return trend;
    };

    const analytics = {
      totalViews: business.views,
      trustScore: business.trustScore,
      averageRating: business.averageRating,
      totalReviews: business.ratingCount,
      viewsTrend: generateTrend(business.views, 7),
      memberSince: business.createdAt
    };

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment view count
    // We don't require auth for this as it's called by the public profile page
    await prisma.business.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ message: 'View recorded' });
  } catch (error: any) {
    console.error('View increment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
