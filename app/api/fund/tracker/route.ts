import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/fund/tracker
 * Returns the total "Formalization Fund" revenue collected from banners.
 */
export async function GET() {
  try {
    // Sum up the costPrice of all banners to simulate the fund
    const aggregates = await prisma.banner.aggregate({
      _sum: {
        costPrice: true
      }
    });

    const activeBannersCount = await prisma.banner.count({
      where: { isActive: true }
    });

    const totalRevenue = aggregates._sum.costPrice || 0;
    
    // We can assume a portion of the revenue goes to the fund, e.g., 20%
    const fundAmount = totalRevenue * 0.2;

    return NextResponse.json({
      totalRevenue,
      fundAmount,
      activeBannersCount,
      currency: 'USD', // Default currency
      lastUpdated: new Date()
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Fund tracker error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
