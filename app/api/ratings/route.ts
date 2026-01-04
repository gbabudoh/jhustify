import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Rating from '@/lib/models/Rating';
import Business from '@/lib/models/Business';
import Message from '@/lib/models/Message';
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

    await connectDB();

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
    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if user has interacted with business (sent a message)
    const hasInteracted = await Message.exists({
      businessId,
      userId: auth.userId,
    });

    // Create or update rating
    const ratingData: any = {
      businessId,
      userId: auth.userId,
      rating,
      verified: !!hasInteracted,
    };

    if (comment && comment.trim()) {
      ratingData.comment = comment.trim();
      // Analyze sentiment using AI
      ratingData.sentimentSummary = await analyzeSentiment(ratingData.comment);
    }

    const existingRating = await Rating.findOneAndUpdate(
      { businessId, userId: auth.userId },
      ratingData,
      { upsert: true, new: true }
    );

    // Update business average rating
    await updateBusinessRating(businessId);

    return NextResponse.json(
      {
        message: 'Rating submitted successfully',
        rating: {
          id: existingRating._id,
          rating: existingRating.rating,
          comment: existingRating.comment,
          sentimentSummary: existingRating.sentimentSummary,
          verified: existingRating.verified,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Rating creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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
    await connectDB();

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

    const ratings = await Rating.find({ businessId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Rating.countDocuments({ businessId });

    // Calculate average rating
    const ratingStats = await Rating.aggregate([
      { $match: { businessId: businessId } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
          distribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    const stats = ratingStats[0] || { average: 0, count: 0, distribution: [] };
    
    // Calculate rating distribution
    const distribution = {
      5: stats.distribution.filter((r: number) => r === 5).length,
      4: stats.distribution.filter((r: number) => r === 4).length,
      3: stats.distribution.filter((r: number) => r === 3).length,
      2: stats.distribution.filter((r: number) => r === 2).length,
      1: stats.distribution.filter((r: number) => r === 1).length,
    };

    const ratingsWithId = ratings.map((rating: any) => {
      const { _id, userId, ...rest } = rating;
      return {
        ...rest,
        id: _id?.toString(),
        userId: userId?._id?.toString(),
        userName: userId?.name || 'Anonymous',
        userEmail: userId?.email || '',
      };
    });

    return NextResponse.json({
      ratings: ratingsWithId,
      stats: {
        average: Math.round(stats.average * 10) / 10,
        count: stats.count,
        distribution,
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Rating fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to update business average rating
 */
async function updateBusinessRating(businessId: string) {
  try {
    const stats = await Rating.aggregate([
      { $match: { businessId: businessId } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Business.findByIdAndUpdate(businessId, {
        averageRating: Math.round(stats[0].average * 10) / 10,
        ratingCount: stats[0].count,
      });
    }
  } catch (error) {
    console.error('Error updating business rating:', error);
  }
}

