import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

// GET - Get single banner
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ banner }, { status: 200 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error fetching banner:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to fetch banner' }, { status: 500 });
  }
}

// PATCH - Update banner (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, imageUrl, linkUrl, position, costPrice, startDate, endDate, isActive } = body;

    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updateData: import('@prisma/client').Prisma.BannerUpdateInput = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (position !== undefined) updateData.position = position as import('@prisma/client').BannerPosition;
    if (costPrice !== undefined) updateData.costPrice = parseFloat(costPrice);
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate dates if both are present
    const vStartDate = startDate ? new Date(startDate) : banner.startDate;
    const vEndDate = endDate ? new Date(endDate) : banner.endDate;
    
    if (vEndDate <= vStartDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const updatedBanner = await prisma.banner.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ banner: updatedBanner, message: 'Banner updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error updating banner:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE - Delete banner (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await prisma.banner.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error deleting banner:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to delete banner' }, { status: 500 });
  }
}
