import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      users,
      businesses,
      verifications,
      messages,
      ratings,
      subscriptions,
      banners,
      revenueResult
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.verification.count(),
      prisma.message.count(),
      prisma.rating.count(),
      prisma.subscription.count(),
      prisma.banner.count(),
      prisma.subscription.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return NextResponse.json({
      users,
      businesses,
      verifications,
      messages,
      ratings,
      subscriptions,
      banners,
      revenue: revenueResult._sum.amount || 0,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Admin stats error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

