import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/lib/models/Banner';

/**
 * GET /api/fund/tracker
 * Returns the total "Formalization Fund" revenue collected from banners.
 */
export async function GET() {
  try {
    await connectDB();

    // Sum up the costPrice of all banners to simulate the fund
    // In a real scenario, this might be a dedicated transaction model
    const fundStats = await Banner.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$costPrice' },
          activeBanners: { 
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } 
          }
        }
      }
    ]);

    const totalRevenue = fundStats[0]?.totalRevenue || 0;
    
    // We can assume a portion of the revenue goes to the fund, e.g., 20%
    const fundAmount = totalRevenue * 0.2;

    return NextResponse.json({
      totalRevenue,
      fundAmount,
      currency: 'USD', // Default currency
      lastUpdated: new Date()
    });
  } catch (error: any) {
    console.error('Fund tracker error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
