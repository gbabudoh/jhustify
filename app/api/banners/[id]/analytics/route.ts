import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Banner from '@/lib/models/Banner';

// POST - Track banner click or impression
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const body = await req.json();
    const { type } = body; // 'click' or 'impression'

    if (!type || !['click', 'impression'].includes(type)) {
      return NextResponse.json({ error: 'Invalid analytics type. Must be "click" or "impression"' }, { status: 400 });
    }

    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Increment the appropriate counter
    if (type === 'click') {
      banner.clickCount += 1;
    } else if (type === 'impression') {
      banner.impressionCount += 1;
    }

    await banner.save();

    return NextResponse.json({
      message: `${type} tracked successfully`,
      [type === 'click' ? 'clickCount' : 'impressionCount']: type === 'click' ? banner.clickCount : banner.impressionCount
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error tracking banner analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to track analytics' }, { status: 500 });
  }
}
