import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (auth.role !== 'BUSINESS_OWNER' && auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId') || auth.userId;

    // Security check: business owners can only see their own stats
    if (auth.role === 'BUSINESS_OWNER' && ownerId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all stats in parallel for efficiency
    const [totalCount, businessStats, messageCount, verifiedCount] = await Promise.all([
      prisma.business.count({
        where: { ownerId },
      }),
      prisma.business.aggregate({
        where: { ownerId },
        _sum: {
          // @ts-expect-error - views field was added in a recent migration and types might not be updated yet
          views: true,
        },
      }),
      prisma.message.count({
        where: {
          business: {
            ownerId,
          },
        },
      }),
      prisma.business.count({
        where: {
          ownerId,
          verificationStatus: 'VERIFIED',
        },
      }),
    ]);

    return NextResponse.json({
      totalListings: totalCount || 0,
      verifiedListings: verifiedCount || 0,
      // @ts-expect-error - views aggregation might not be in the generated types yet
      totalViews: businessStats?._sum?.views || 0,
      activeLeads: messageCount || 0,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Stats fetch error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
