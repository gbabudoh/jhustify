import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Track banner click or impression
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { type } = body; // 'click' or 'impression'

    if (!type || !['click', 'impression'].includes(type)) {
      return NextResponse.json({ error: 'Invalid analytics type. Must be "click" or "impression"' }, { status: 400 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Increment the appropriate counter
    const updateData: { clickCount?: { increment: number }; impressionCount?: { increment: number } } = {};
    if (type === 'click') {
      updateData.clickCount = { increment: 1 };
    } else if (type === 'impression') {
      updateData.impressionCount = { increment: 1 };
    }

    const updatedBanner = await prisma.banner.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
      message: `${type} tracked successfully`,
      [type === 'click' ? 'clickCount' : 'impressionCount']: type === 'click' ? updatedBanner.clickCount : updatedBanner.impressionCount
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error tracking banner analytics:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to track analytics' }, { status: 500 });
  }
}
