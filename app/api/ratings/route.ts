import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';
import { analyzeSentiment } from '@/lib/utils/ai';

/**
 * POST /api/ratings
 * Create or update a rating for a business
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only consumers can rate businesses
    if (auth.role !== 'CONSUMER') {
      return NextResponse.json(
        { error: 'Only consumers can rate businesses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { businessId, rating, comment } = body;

    if (!businessId || !rating) {
      return NextResponse.json(
        { error: 'Business ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if user has interacted with business (sent a message)
    const interaction = await prisma.message.findFirst({
      where: {
        businessId,
        userId: auth.userId,
      }
    });

    let sentimentSummary = null;
    if (comment && comment.trim()) {
      // Analyze sentiment using AI
      sentimentSummary = await analyzeSentiment(comment.trim());
    }

    const upsertRating = await prisma.rating.upsert({
      where: {
        businessId_userId: {
          businessId,
          userId: auth.userId
        }
      },
      update: {
        rating,
        comment: comment?.trim() || null,
        sentimentSummary,
        verified: !!interaction,
      },
      create: {
        businessId,
        userId: auth.userId,
        rating,
        comment: comment?.trim() || null,
        sentimentSummary,
        verified: !!interaction,
      }
    });

    // Update business average rating
    await updateBusinessRating(businessId);

    return NextResponse.json(
      {
        message: 'Rating submitted successfully',
        rating: {
          id: upsertRating.id,
          rating: upsertRating.rating,
          comment: upsertRating.comment,
          sentimentSummary: upsertRating.sentimentSummary,
          verified: upsertRating.verified,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Rating creation error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ratings?businessId=xxx
 * Get ratings for a business
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [ratings, total, aggregates, distributionData] = await Promise.all([
      prisma.rating.findMany({
        where: { businessId },
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.rating.count({ where: { businessId } }),
      prisma.rating.aggregate({
        where: { businessId },
        _avg: { rating: true },
        _count: { _all: true }
      }),
      prisma.rating.groupBy({
        by: ['rating'],
        where: { businessId },
        _count: { _all: true }
      })
    ]);

    // Calculate rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionData.forEach(item => {
      distribution[item.rating] = item._count._all;
    });

    const ratingsResponse = ratings.map(rating => ({
      ...rating,
      userName: rating.user?.name || 'Anonymous',
      userEmail: rating.user?.email || '',
    }));

    return NextResponse.json({
      ratings: ratingsResponse,
      stats: {
        average: aggregates._avg.rating ? Math.round(aggregates._avg.rating * 10) / 10 : 0,
        count: aggregates._count._all,
        distribution,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Rating fetch error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to update business average rating
 */
async function updateBusinessRating(businessId: string) {
  try {
    const stats = await prisma.rating.aggregate({
      where: { businessId },
      _avg: { rating: true },
      _count: { _all: true }
    });

    if (stats._count._all > 0) {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
          ratingCount: stats._count._all,
        }
      });
    }
  } catch (error) {
    console.error('Error updating business rating:', error);
  }
}
